require('dotenv').config(); // ✅ .env load karo

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const connection = require('./connection'); // bas ek mongoose.connect file
const User = require('./models/users');

const app = express();
const PORT = process.env.PORT || 7200;
const JWT_SECRET = process.env.JWT_SECRET ;

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));


const auth = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json('Access Denied');
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json('Invalid token');
    }
};


app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({
            balance: user.balance,
            username: user.username,
            token,
            userId: user._id
        });
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


app.post('/api/coinflip', auth, async (req, res) => {
    try {
        const { choice, betAmount } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return res.status(404).json('User not found');
        if (betAmount > user.balance) return res.status(400).json('Insufficient balance');

        const result = Math.random() < 0.5 ? 'heads' : 'tails';
        let message;

        if (result === choice) {
            user.balance += betAmount;
            message = `You won! The coin landed on ${result}.`;
        } else {
            user.balance -= betAmount;
            message = `You lost. The coin landed on ${result}.`;
        }

        await user.save();
        res.status(200).json({ message, balance: user.balance });
    } catch (err) {
        console.error(err);
        res.status(500).json('Server error');
    }
});


app.get('/api/rankings', async (req, res) => {
    try {
        const users = await User.find().sort({ balance: -1 }).select('username balance');
        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to retrieve rankings' });
    }
});


app.post('/api/update-balance', async (req, res) => {
    try {
        const { userId, newBalance } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.balance = newBalance;
        await user.save();
        res.status(200).json({ userId, balance: user.balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});


app.post('/api/user/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ balance: user.balance });
    } catch (err) {
        console.error("Error fetching the balance", err);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
