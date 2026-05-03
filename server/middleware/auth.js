const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'app-menus-secret-key';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ success: false, message: 'Token manquant' });
  try {
    req.user = jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' });
  }
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ success: false, message: 'Accès réservé aux administrateurs' });
  next();
}

module.exports = { authenticate, requireAdmin };
