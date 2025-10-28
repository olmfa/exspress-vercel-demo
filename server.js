const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const { isAuthenticated } = require('./middleware/authMiddleware');

connectDB();

const app = express();

app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session configuration
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'fallback-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        touchAfter: 24 * 3600,
        crypto: {
            secret: process.env.SESSION_SECRET || 'fallback-secret-key',
        },
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 днів
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
    name: 'sessionId', // Кастомна назва cookie
};

app.use(session(sessionConfig));


// app.use((req, res, next) => {
//     console.log('Session ID:', req.sessionID);
//     console.log('Session data:', req.session);
//     next();
// });


app.use('/api', authRoutes);


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/secret', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'secret.html'));
});


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Щось пішло не так!' });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
        console.log(`🚀 Сервер працює на http://localhost:${PORT}`)
    );
}

module.exports = app;
