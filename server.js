const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection URI
const uri = "mongodb+srv://saivenkat:saivenkat@cluster10.cpz1vqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster10";

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongo() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

connectToMongo();

const db = client.db("CINEWAVE"); 
const usersCollection = db.collection("users"); 

// Middleware for authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).send('Token required');
    }
    jwt.verify(token, '12345', (err, user) => {
        if (err) {
            return res.status(403).send('Invalid token');
        }
        req.user = user;
        next();
    });
};

// Register Route
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            username,
            email,
            password: hashedPassword
        };

        await usersCollection.insertOne(newUser);
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide all fields' });
    }

    try {
        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Error logging in' });
    }
});

// Profile Route
app.get('/profile', authenticate, async (req, res) => {
    try {
        const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// Admin Routes (Login & Get All Users)
app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ userId: 'admin' }, 'your_secret_key', { expiresIn: '1h' });
        res.json({ message: 'Admin logged in', token });
    } else {
        res.status(401).json({ message: 'Invalid credentials' });
    }
});

// Get All Users for Admin
app.get('/admin/users', authenticate, async (req, res) => {
    try {
        if (req.user.userId !== 'admin') {
            return res.status(403).send('Admin access required');
        }

        const users = await usersCollection.find().toArray();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});

// Start server
app.listen(8081, () => {
    console.log('Server started on port 8081');
});
