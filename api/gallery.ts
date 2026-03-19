import { list } from "@vercel/blob";

export default async function handler(req: any, res: any) {
  console.log("GET /api/gallery request received (Vercel Serverless)");
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      console.error("BLOB_READ_WRITE_TOKEN is missing in process.env");
      return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN is not configured in Vercel Environment Variables" });
    }

    console.log("Fetching blobs from Vercel...");
    const { blobs } = await list({ token });
    console.log(`Found ${blobs.length} blobs`);
    
    const logo = blobs.find(b => b.pathname.includes('APOLLO MSM LOGO.png'));
    
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
    res.json({ images, logoUrl: logo?.url });
  } catch (error) {
    console.error("Error listing blobs:", error);
    res.status(500).json({ 
      error: "Failed to list gallery images", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
}
