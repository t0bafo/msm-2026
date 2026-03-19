import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { list } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server.ts...");
  try {
    const app = express();
    const PORT = 3000;

    // Health check route
    app.get("/api/health", (req, res) => {
      res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // API Route to list gallery images from Vercel Blob
    app.get("/api/gallery", async (req, res) => {
      console.log("GET /api/gallery request received");
      try {
        const token = process.env.BLOB_READ_WRITE_TOKEN;
        if (!token) {
          console.error("BLOB_READ_WRITE_TOKEN is missing in process.env");
          return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN is not configured in Secrets" });
        }

        console.log("Fetching blobs from Vercel...");
        const { blobs } = await list({ token });
        console.log(`Found ${blobs.length} blobs`);
        
        // Filter for common image formats
        const images = blobs
          .filter(blob => blob.pathname.match(/\.(jpg|jpeg|png|webp|gif)$/i))
          .map(blob => ({
            url: blob.url,
            pathname: blob.pathname,
            size: blob.size,
            uploadedAt: blob.uploadedAt
          }));

        console.log(`Returning ${images.length} images`);
        res.json(images);
      } catch (error) {
        console.error("Error listing blobs:", error);
        res.status(500).json({ 
          error: "Failed to list gallery images", 
          details: error instanceof Error ? error.message : String(error) 
        });
      }
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Initializing Vite middleware...");
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
      console.log("Vite middleware initialized");
    } else {
      console.log("Running in production mode");
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*all', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on 0.0.0.0:${PORT}`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("FATAL: Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
