const jwt = require("jsonwebtoken");

// Use environment variable for security, fallback for dev
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(403).json({ error: "No authorization header provided" });
  }

  // Expecting: "Bearer <token>" OR just "<token>"
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : authHeader;

  if (!token) {
    return res.status(403).json({ error: "Token missing" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // attach decoded payload { id, role, ... }
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  
}

module.exports = authMiddleware;
