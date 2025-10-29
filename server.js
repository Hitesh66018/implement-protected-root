const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();
const app = express();
app.use(express.json());

const users = [
  { id: 1, username: 'john', password: '12345' },
  { id: 2, username: 'alice', password: 'abcd' }
];

// Login route — generates JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {
    expiresIn: '1h'
  });

  res.json({ message: 'Login successful', token });
});

// Protected route
app.get('/dashboard', authMiddleware, (req, res) => {
  res.json({ message: `Welcome ${req.user.username}! This is your dashboard.` });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
