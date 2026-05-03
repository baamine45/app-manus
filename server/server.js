const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const menuItemsRouter = require('./routes/menuItems');
const authRouter = require('./routes/auth');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/app-menus';

async function seedDefaultAccounts() {
  const admin = await User.findOne({ username: 'admin' });
  if (!admin) {
    await User.create({ username: 'admin', password: 'admin123', role: 'admin' });
    console.log('👑 Compte admin créé : admin / admin123');
  }
  const user = await User.findOne({ username: 'user' });
  if (!user) {
    await User.create({ username: 'user', password: 'user123', role: 'user' });
    console.log('👤 Compte user créé  : user / user123');
  }
}

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('✅ Connecté à MongoDB');
    await seedDefaultAccounts();
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB:', err.message);
    process.exit(1);
  });

app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/menu-items', menuItemsRouter);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connecté' : 'déconnecté',
  });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports = app;
