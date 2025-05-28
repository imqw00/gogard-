export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url query parameter" });
  }

  try {
    const response = await fetch(url);
    const contentType = response.headers.get("content-type");
    const buffer = await response.arrayBuffer();

    res.status(response.status);
    if (contentType) {
      res.setHeader("Content-Type", contentType);
    }

    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error("Proxy error:", err);
    res.status(500).json({ error: "Proxy failed", message: err.message });
  }
}
