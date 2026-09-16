#!/usr/bin/env node
// Import photos from a Claude Design project export into the site.
//
//   npm run import-photos -- <export.zip | extracted-folder> [--out <repoRoot>]
//
// 1. Copies everything in the export's uploads/ into public/uploads/ (names kept).
// 2. Decodes the data: URLs in .image-slots.state.json into public/slots/<slotId>.<ext>
//    and writes src/lib/defaultPhotos.json ({slotId: {url, s, x, y}}).
// --out exists so the script can be tested without touching the real repo.

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const STATE_FILE = ".image-slots.state.json";
const MIME_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/heic": "heic",
  "image/heif": "heif",
  "image/avif": "avif",
  "image/svg+xml": "svg",
};

function die(msg) {
  console.error("import-photos: " + msg);
  process.exit(1);
}

function parseArgs(argv) {
  let input = null;
  let out = REPO_ROOT;
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--out") {
      if (!argv[i + 1]) die("--out needs a path");
      out = path.resolve(argv[++i]);
    } else if (!input) {
      input = path.resolve(argv[i]);
    } else {
      die("unexpected argument: " + argv[i]);
    }
  }
  if (!input) die("usage: npm run import-photos -- <export.zip | folder> [--out <repoRoot>]");
  return { input, out };
}

function hasUnzip() {
  try {
    execFileSync("unzip", ["-v"], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

// Breadth-first search so the shallowest match wins (exports may nest one level).
function findEntry(root, name, wantDir) {
  const queue = [{ dir: root, depth: 0 }];
  while (queue.length) {
    const { dir, depth } = queue.shift();
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { continue; }
    for (const e of entries) {
      if (e.name === name && (wantDir ? e.isDirectory() : e.isFile())) return path.join(dir, e.name);
    }
    if (depth >= 3) continue;
    for (const e of entries) {
      if (e.isDirectory() && e.name !== "node_modules" && e.name !== "__MACOSX") {
        queue.push({ dir: path.join(dir, e.name), depth: depth + 1 });
      }
    }
  }
  return null;
}

function copyDir(src, dest) {
  let files = 0;
  let bytes = 0;
  fs.mkdirSync(dest, { recursive: true });
  for (const e of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, e.name);
    const to = path.join(dest, e.name);
    if (e.isDirectory()) {
      const r = copyDir(from, to);
      files += r.files;
      bytes += r.bytes;
    } else if (e.isFile()) {
      fs.copyFileSync(from, to);
      files++;
      bytes += fs.statSync(from).size;
    }
  }
  return { files, bytes };
}

function main() {
  const { input, out } = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(input)) die("not found: " + input);

  let root = input;
  let tmp = null;
  if (fs.statSync(input).isFile()) {
    if (!/\.zip$/i.test(input)) die("expected a .zip file or a folder: " + input);
    if (!hasUnzip()) die("the `unzip` command is not installed. Install it (e.g. `sudo apt install unzip`) or extract the zip yourself and pass the folder.");
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "design-export-"));
    execFileSync("unzip", ["-q", "-o", input, "-d", tmp], { stdio: "inherit" });
    root = tmp;
  }

  try {
    let copied = { files: 0, bytes: 0 };
    const uploadsDir = findEntry(root, "uploads", true);
    if (uploadsDir) {
      copied = copyDir(uploadsDir, path.join(out, "public", "uploads"));
    } else {
      console.warn("warning: no uploads/ folder found in the export");
    }

    let slots = 0;
    let slotBytes = 0;
    const photos = {};
    const stateFile = findEntry(root, STATE_FILE, false);
    if (stateFile) {
      let state;
      try { state = JSON.parse(fs.readFileSync(stateFile, "utf8")); } catch (e) { die(`could not parse ${stateFile}: ${e.message}`); }
      if (!state || typeof state !== "object") die(`${stateFile} is not a JSON object`);
      const slotsDir = path.join(out, "public", "slots");
      fs.mkdirSync(slotsDir, { recursive: true });

      for (const slotId of Object.keys(state)) {
        const entry = state[slotId];
        const u = entry && typeof entry.u === "string" ? entry.u : "";
        const m = /^data:([^;,]+)((?:;[^;,]*)*),(.*)$/s.exec(u);
        if (!m) continue;
        if (!/^[\w-]+$/.test(slotId)) {
          console.warn(`skipping slot with unsafe id: ${slotId}`);
          continue;
        }
        const mime = m[1].toLowerCase();
        const ext = MIME_EXT[mime] || mime.split("/")[1]?.replace(/[^\w]/g, "") || "bin";
        const isBase64 = /;base64/i.test(m[2]);
        const data = isBase64 ? Buffer.from(m[3], "base64") : Buffer.from(decodeURIComponent(m[3]), "utf8");
        const file = `${slotId}.${ext}`;
        fs.writeFileSync(path.join(slotsDir, file), data);
        slots++;
        slotBytes += data.length;

        const rec = { url: `/slots/${file}` };
        for (const k of ["s", "x", "y"]) {
          if (typeof entry[k] === "number" && Number.isFinite(entry[k])) rec[k] = entry[k];
        }
        photos[slotId] = rec;
      }
    } else {
      console.warn(`warning: no ${STATE_FILE} found in the export`);
    }

    const sorted = {};
    for (const k of Object.keys(photos).sort()) sorted[k] = photos[k];
    const jsonPath = path.join(out, "src", "lib", "defaultPhotos.json");
    fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
    if (stateFile) fs.writeFileSync(jsonPath, JSON.stringify(sorted, null, 2) + "\n");

    const mb = ((copied.bytes + slotBytes) / 1024 / 1024).toFixed(2);
    console.log(`Copied ${copied.files} file(s) from uploads/ to ${path.join(out, "public", "uploads")}`);
    console.log(`Wrote ${slots} slot photo(s) to ${path.join(out, "public", "slots")}`);
    if (stateFile) console.log(`Wrote ${jsonPath}`);
    console.log(`Total: ${mb} MB`);
  } finally {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  }
}

main();
