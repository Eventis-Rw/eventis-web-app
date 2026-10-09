import { readFile } from "node:fs/promises";
import path from "node:path";

export async function GET() {
  const image = await readFile(path.join(process.cwd(), "..", "event.jpg"));

  return new Response(image, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
