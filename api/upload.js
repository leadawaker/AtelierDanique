import { handleUpload } from "@vercel/blob/client";
import { isAuthed } from "./_lib/session.js";
import { jsonBody } from "./_lib/body.js";

// Token route for browser-to-Blob photo uploads from the studio. The photo
// itself never passes through this function (which has a 4.5 MB body limit);
// the browser asks here for a short-lived token, then uploads straight to Blob.
const PATHNAME = /^photos\/[\w-]+\.(jpe?g|png|webp|heic|heif|gif)$/i;

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = jsonBody(req);
    if (!body) throw new Error("Invalid request body");

    const result = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async (pathname) => {
        if (!isAuthed(req)) throw new Error("Not logged in");
        if (!PATHNAME.test(pathname)) throw new Error("Invalid file name");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/gif"],
          maximumSizeInBytes: 25 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      // No onUploadCompleted: the studio saves the returned URL itself via
      // /api/content, so no webhook back from Blob is needed.
    });
    return res.status(200).json(result);
  } catch (err) {
    return res.status(400).json({ error: err.message || "Upload failed" });
  }
}
