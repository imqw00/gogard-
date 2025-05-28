import fetch from 'node-fetch';

export default async function handler(req, res) {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: 'Missing url query parameter' });
  }

  try {
    // Validate URL
    const targetUrl = new URL(url);

    // Fetch the target URL
    const response = await fetch(targetUrl);

    // Set headers except forbidden ones
    res.status(response.status);
    response.headers.forEach((value, key) => {
      if (
        [
          'content-encoding',
          'content-length',
          'transfer-encoding',
          'connection',
          'keep-alive',
          'proxy-authenticate',
          'proxy-authorization',
          'te',
          'trailer',
          'upgrade',
        ].includes(key.toLowerCase())
      ) {
        return;
      }
      res.setHeader(key, value);
    });

    // Stream response body
    const data = await response.arrayBuffer();
    res.send(Buffer.from(data));
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy fetch failed', message: err.message });
  }
}
