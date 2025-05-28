import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const targetUrl = req.query.url;
    if (!targetUrl) {
      res.status(400).json({ error: 'Missing url parameter' });
      return;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: req.headers,
      body: req.method === 'GET' ? null : JSON.stringify(req.body),
    });

    const data = await response.text();

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
