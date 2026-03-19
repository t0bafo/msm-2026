console.log("SERVER.TS ENTRY POINT REACHED");
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { list } from "@vercel/blob";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  console.log("Starting server.ts - VERSION 2.1 - DEBUGGING 404...");
  try {
    const app = express();
    const PORT = 3000;

    // Request logging middleware
    app.use((req, res, next) => {
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
      next();
    });

    // Health check route
    app.get("/api/health", (req, res) => {
      console.log("Health check hit");
      res.json({ status: "ok", timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
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

    // 404 handler for /api routes
    app.all("/api/*", (req, res) => {
      console.log(`404 - API Route not found: ${req.method} ${req.url}`);
      res.status(404).json({ error: `API Route not found: ${req.method} ${req.url}` });
    });

    // Vite middleware for development
    if (process.env.NODE_ENV !== "production") {
      console.log("Initializing Vite middleware with appType: spa...");
      try {
        const vite = await createViteServer({
          server: { 
            middlewareMode: true,
            hmr: false // Disable HMR to prevent potential hangs
          },
          appType: "spa",
          logLevel: 'info'
        });
        console.log("Vite server created successfully");
        app.use(vite.middlewares);
        console.log("Vite middleware attached to Express");
      } catch (viteError) {
        console.error("ERROR: Failed to create Vite server:", viteError);
      }
    } else {
      console.log("Running in production mode");
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      // Standard catch-all for Express 5 to serve SPA
      app.get('*all', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on 0.0.0.0:${PORT}`);
    });
  } catch (error) {
    console.error("FATAL: Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
