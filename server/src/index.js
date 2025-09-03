const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

app.get('/', (_req, res) => res.json({ ok: true }));

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password, displayName, role = 'student' } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { email, password: hashed, displayName, role }
    });
    res.json({ id: user.id, email: user.email, displayName: user.displayName });
  } catch (e) {
    res.status(400).json({ error: 'User exists or invalid data' });
  }
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role, points: user.points, currentStreak: user.currentStreak }});
});

// Leaderboard
app.get('/leaderboard', async (_req, res) => {
  const top = await prisma.user.findMany({
    orderBy: { points: 'desc' },
    take: 10,
    select: { id: true, displayName: true, points: true, currentStreak: true }
  });
  res.json(top);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
