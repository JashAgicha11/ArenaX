const jwt = require('jsonwebtoken');
const { User, Player } = require('../models');
const { generateUniquePlayerId } = require('../utils/playerId');

const generateTokens = (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
  );

  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

const sanitizeUser = (userDoc) => {
  const user = userDoc.toJSON();
  delete user.password;
  delete user.refreshToken;
  user._id = user.id;
  return user;
};

const register = async (req, res) => {
  try {
    const { name, email, password, role = 'player', sportPreferences = [] } = req.body;

    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    if (role === 'admin') {
      return res.status(400).json({ error: 'Admin role cannot be assigned during registration.' });
    }

    const playerId = role === 'player' ? await generateUniquePlayerId() : undefined;

    const user = await User.create({
      name,
      email,
      password,
      role,
      playerId,
    });

    if (role === 'player') {
      await Player.create({
        userId: user.id,
        playerId,
        displayName: name,
        sportPreferences,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      message: 'User registered successfully.',
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Registration failed. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.json({
      message: 'Login successful.',
      user: sanitizeUser(user),
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Login failed. Please try again.' });
  }
};

const refresh = async (req, res) => {
  try {
    const { user } = req;
    const { accessToken, refreshToken } = generateTokens(user.id);
    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      message: 'Token refreshed successfully.',
      accessToken,
      refreshToken,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Token refresh failed.' });
  }
};

const logout = async (req, res) => {
  try {
    req.user.refreshToken = undefined;
    await req.user.save();
    return res.json({ message: 'Logout successful.' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Logout failed.' });
  }
};

const me = async (req, res) => res.json({ user: sanitizeUser(req.user) });

const updateMe = async (req, res) => {
  try {
    const { name, sportPreferences } = req.body;
    if (typeof name === 'string' && name.trim()) {
      req.user.name = name.trim();
    }
    await req.user.save();

    if (req.user.role === 'player' && Array.isArray(sportPreferences)) {
      await Player.update(
        { sportPreferences },
        { where: { userId: req.user.id } }
      );
    }

    const updatedUser = await User.findByPk(req.user.id);
    return res.json({ message: 'Profile updated successfully.', user: sanitizeUser(updatedUser) });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to update profile.' });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userWithPassword = await User.findByPk(req.user.id);
    if (!userWithPassword) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isCurrentPasswordValid = await userWithPassword.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }

    userWithPassword.password = newPassword;
    await userWithPassword.save();

    return res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to change password.' });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  me,
  updateMe,
  changePassword,
};
