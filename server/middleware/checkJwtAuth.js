const jwt = require('jsonwebtoken');

const JWT_SECRET = 'supersecretjwtkey'; // Hardcoded for demo

// Session storage (this should be imported from the main server file in a real app)
let sessions = new Map();

// Function to set sessions (called from main server)
function setSessions(sessionMap) {
  sessions = sessionMap;
}

function checkJwtAuth(req, res, next) {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return res.status(401).json({
        error: 'Authorization header missing',
        message: 'Authorization header is required',
      });
    }

    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Invalid authorization format',
        message: 'Authorization header must start with "Bearer "',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        error: 'Token missing',
        message: 'Access token is required',
      });
    }

    // First verify JWT token
    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);

      if (!payload) {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Token verification failed',
        });
      }

      if (payload.admin !== true) {
        return res.status(403).json({
          error: 'Insufficient permissions',
          message: 'Admin access required',
        });
      }
    } catch (jwtErr) {
      if (jwtErr.name === 'TokenExpiredError') {
        // Clean up expired session if it exists
        if (sessions.has(token)) {
          sessions.delete(token);
        }
        return res.status(401).json({
          error: 'Token expired',
          message: 'Access token has expired. Please login again.',
        });
      }

      if (jwtErr.name === 'JsonWebTokenError') {
        return res.status(401).json({
          error: 'Invalid token',
          message: 'Access token is invalid',
        });
      }

      return res.status(401).json({
        error: 'Token verification failed',
        message: 'Unable to verify access token',
      });
    }

    // Check if session exists and is valid
    const session = sessions.get(token);
    if (!session) {
      return res.status(401).json({
        error: 'Session not found',
        message: 'Session has expired or is invalid. Please login again.',
      });
    }

    if (session.expiresAt < Date.now()) {
      // Clean up expired session
      sessions.delete(token);
      return res.status(401).json({
        error: 'Session expired',
        message: 'Your session has expired. Please login again.',
      });
    }

    // Update last activity
    session.lastActivity = Date.now();
    sessions.set(token, session);

    req.admin = true;
    req.user = payload;
    req.session = session;
    return next();
  } catch (err) {
    console.error('JWT Auth middleware error:', err);
    return res.status(500).json({
      error: 'Authentication error',
      message: 'An error occurred during authentication',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }
}

module.exports = { checkJwtAuth, setSessions };
