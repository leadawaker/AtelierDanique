// Phone photos are 5-15 MB. Downscale to `maxEdge` px on the long edge as a
// JPEG. Returns null if the browser cannot decode the file (e.g. HEIC outside
// Safari), so the caller can fall back to the original.
export async function shrinkImage(file, maxEdge = 2400, quality = 0.88) {
  try {
    const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const k = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * k);
    canvas.height = Math.round(bitmap.height * k);
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close && bitmap.close();
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', quality));
    return blob || null;
  } catch (e) {
    return null;
  }
}
