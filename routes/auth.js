const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Заповніть всі поля' });
        }
        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: 'Пароль має бути мінімум 6 символів' });
        }

        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res.status(400).json({ error: 'Користувач вже існує' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();

        req.session.userId = user._id;
        req.session.username = user.username;

        res.status(201).json({
            message: 'Реєстрація успішна',
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        console.error('Помилка реєстрації:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Заповніть всі поля' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        req.session.userId = user._id;
        req.session.username = user.username;

        res.json({
            message: 'Вхід успішний',
            user: { username: user.username, email: user.email },
        });
    } catch (err) {
        console.error('Помилка логіну:', err);
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Помилка виходу' });
        }
        res.json({ message: 'Вихід успішний' });
    });
});

router.get('/me', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findById(req.session.userId).select(
            '-password'
        );
        res.json({ user });
    } catch (err) {
        res.status(500).json({ error: 'Помилка сервера' });
    }
});

module.exports = router;
