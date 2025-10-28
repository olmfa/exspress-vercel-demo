const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// Реєстрація
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Валідація
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Всі поля обов'язкові" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: 'Пароль має бути мінімум 6 символів' });
        }

        // Перевірка на існуючого користувача
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });
        if (existingUser) {
            return res
                .status(400)
                .json({
                    error: 'Користувач з таким email або username вже існує',
                });
        }

        // Хешування пароля
        const hashed = await bcrypt.hash(password, 10);

        // Створення користувача
        const user = new User({ username, email, password: hashed });
        await user.save();

        // Збереження сесії
        req.session.userId = user._id.toString();
        req.session.username = user.username;
        req.session.email = user.email;

        // ВАЖЛИВО: чекаємо збереження сесії
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res
                    .status(500)
                    .json({ error: 'Помилка збереження сесії' });
            }
            res.json({
                message: 'Реєстрація успішна',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Помилка реєстрації' });
    }
});

// Логін
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Валідація
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "Email та пароль обов'язкові" });
        }

        // Пошук користувача
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        // Перевірка пароля
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Невірний email або пароль' });
        }

        // Збереження сесії
        req.session.userId = user._id.toString();
        req.session.username = user.username;
        req.session.email = user.email;

        // ВАЖЛИВО: чекаємо збереження сесії
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res
                    .status(500)
                    .json({ error: 'Помилка збереження сесії' });
            }
            res.json({
                message: 'Вхід успішний',
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                },
            });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Помилка входу' });
    }
});

// Логаут
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Помилка виходу' });
        }
        res.clearCookie('sessionId');
        res.json({ message: 'Вихід успішний' });
    });
});

// Отримання даних користувача
router.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Необхідна авторизація' });
        }

        // Отримуємо повні дані користувача з бази
        const user = await User.findById(req.session.userId).select(
            '-password'
        );

        if (!user) {
            return res.status(404).json({ error: 'Користувача не знайдено' });
        }

        res.json({
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Помилка отримання даних' });
    }
});

module.exports = router;
