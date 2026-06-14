async function readJsonBody(req) {
  const cached = req.body;
  if (cached !== undefined && cached !== null) {
    if (typeof cached === 'string') {
      return cached ? JSON.parse(cached) : {};
    }
    return cached;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

function sendNoContent(res) {
  res.statusCode = 204;
  res.end();
}

function setCors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = { readJsonBody, sendJson, sendNoContent, setCors };
