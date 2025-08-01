const config = require('../config');

function checkApiKey(req, res, next) {
  try {
    const key = req.headers['x-api-key'];

    if (!key) {
      return res.status(401).json({
        error: 'API key missing',
        message: 'X-API-Key header is required',
      });
    }

    if (key !== config.api.secretKey) {
      return res.status(403).json({
        error: 'Invalid API key',
        message: 'The provided API key is invalid',
      });
    }

    next();
  } catch (err) {
    console.error('API Key middleware error:', err);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during API key validation',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

module.exports = checkApiKey;
