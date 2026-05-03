const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { authenticate, requireAdmin } = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'app-menus-secret-key';
const JWT_EXPIRES = '24h';

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ success: false, message: 'Username et mot de passe requis' });
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Identifiants incorrects' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const exists = await User.findOne({ username });
    if (exists)
      return res.status(400).json({ success: false, message: "Ce nom d'utilisateur existe déjà" });
    const user = new User({ username, password, role: role || 'user' });
    await user.save();
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES });
    res.status(201).json({ success: true, token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    if (err.name === 'ValidationError')
      return res.status(400).json({ success: false, message: Object.values(err.errors).map(e => e.message).join(', ') });
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

// PUT /api/auth/change-password — changer son propre mot de passe
router.put('/change-password', authenticate, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ success: false, message: 'Les deux mots de passe sont requis' });
    if (newPassword.length < 6)
      return res.status(400).json({ success: false, message: 'Minimum 6 caractères' });
    const user = await User.findById(req.user.id);
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Mot de passe actuel incorrect' });
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Mot de passe modifié avec succès' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/auth/users — liste tous les utilisateurs (admin)
router.get('/users', authenticate, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/auth/users/:id/role — changer le rôle (admin)
router.put('/users/:id/role', authenticate, requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    if (!['admin', 'user'].includes(role))
      return res.status(400).json({ success: false, message: 'Rôle invalide' });
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/auth/users/:id — supprimer un utilisateur (admin)
router.delete('/users/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    if (req.user.id === req.params.id)
      return res.status(400).json({ success: false, message: 'Vous ne pouvez pas supprimer votre propre compte' });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur non trouvé' });
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
