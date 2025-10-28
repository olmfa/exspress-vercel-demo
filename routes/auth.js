// routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();

    req.session.userId = user._id;
    req.session.username = user.username;
    res.json({ message: 'Реєстрація успішна' });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(400).json({ error: 'Невірні дані' });
    }
    req.session.userId = user._id;
    req.session.username = user.username;
    res.json({ message: 'Вхід успішний' });
});

router.post('/logout', (req, res) => {
    req.session.destroy(() => res.json({ message: 'Вихід успішний' }));
});

router.get('/me', (req, res) => {
    if (!req.session.userId)
        return res.status(401).json({ error: 'Необхідна авторизація' });
    res.json({
        user: { id: req.session.userId, username: req.session.username },
    });
});

module.exports = router;
