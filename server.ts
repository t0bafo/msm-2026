import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { list } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route to list gallery images from Vercel Blob
  app.get("/api/gallery", async (req, res) => {
    try {
      const token = process.env.BLOB_READ_WRITE_TOKEN;
      if (!token) {
        return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN is not configured" });
      }

      const { blobs } = await list({ token });
      
      // Deduplication logic: Omit images with same size and pathname
      const seen = new Set();
      const images = [];

      for (const blob of blobs) {
        // Filter for common image formats
        if (!blob.pathname.match(/\.(jpg|jpeg|png|webp|gif)$/i)) continue;

        const key = `${blob.size}-${blob.pathname}`;
        if (!seen.has(key)) {
          seen.add(key);
          images.push({
            url: blob.url,
            pathname: blob.pathname,
            size: blob.size,
            uploadedAt: blob.uploadedAt
          });
        }
      }

      res.json(images);
    } catch (error) {
      console.error("Error listing blobs:", error);
      res.status(500).json({ error: "Failed to list gallery images" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
