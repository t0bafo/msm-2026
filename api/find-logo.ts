import { list } from "@vercel/blob";

export default async function handler(req: any, res: any) {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return res.status(500).json({ error: "No token" });
    const { blobs } = await list({ token });
    const logo = blobs.find(b => b.pathname.includes("APOLLO MSM LOGO.png"));
    res.json({ url: logo ? logo.url : null });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
}
