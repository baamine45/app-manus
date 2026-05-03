const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: [true, "Le nom d'utilisateur est obligatoire"], unique: true, trim: true, minlength: [3, 'Minimum 3 caractères'] },
    password: { type: String, required: [true, 'Le mot de passe est obligatoire'], minlength: [6, 'Minimum 6 caractères'] },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
