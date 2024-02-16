const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

// Function to hash the password
async function hashPassword(password) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return hashedPassword;
}

// API endpoint to hash the password
router.post('/', async (req, res,next) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const hashedPassword = await hashPassword(password);
    res.json({ success: true, hashedPassword });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

module.exports = router;