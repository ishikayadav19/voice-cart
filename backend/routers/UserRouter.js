const express = require('express');
const supabase = require('../connection');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const ObjectId = require('bson-objectid');

const router= express.Router();

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
};

router.post('/add', async (req, res) => {
    try {
        const id = new ObjectId().toString();
        const { error } = await supabase.from('usersdata').insert([{ id, ...req.body }]);
        if (error) {
            if (error.code === '23505') return res.status(400).json({ message: "Email already registered" });
            throw error;
        }
        res.status(200).json({ id, ...req.body });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Some error occured" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const { data: user, error } = await supabase.from('usersdata').select('*').eq('email', email).single();
        
        if (error || !user || user.password !== password) {
            return res.status(401).json({ message: "Invalid Email or password" });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user.id, name: user.name, email: user.email, role: "user" }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Some error occured" });
    }
});

router.get('/getall', async (req, res) => {
    const { data, error } = await supabase.from('usersdata').select('*');
    if (error) return res.status(500).json(error);
    res.status(200).json(data);
});

router.get('/getbycity/:city', async (req, res) => {
    const { data, error } = await supabase.from('usersdata').select('*').eq('city', req.params.city);
    if (error) return res.status(500).json(error);
    res.status(200).json(data);
});

router.get('/getbyemail2:email', async (req, res) => {
    const { data, error } = await supabase.from('usersdata').select('*').eq('email', req.params.email).single();
    if (error) return res.status(500).json(error);
    res.status(200).json(data);
});

router.get('/getbyid/:id', async (req, res) => {
    const { data, error } = await supabase.from('usersdata').select('*').eq('id', req.params.id).single();
    if (error) return res.status(500).json(error);
    res.status(200).json(data);
});

router.put('/update/:id', async (req, res) => {
    const { data, error } = await supabase.from('usersdata').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json(error);
    res.status(200).json(data);
});

router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const allowedFields = ['name', 'email', 'phone', 'city'];
        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });
        const { data: user, error } = await supabase.from('usersdata').update(updates).eq('id', req.user.id).select().single();
        if (error || !user) return res.status(404).json({ message: 'User not found' });
        delete user.password;
        user.role = "user";
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update profile' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { data, error } = await supabase.from('usersdata').delete().eq('id', req.params.id).select().single();
    if (error) return res.status(500).json(error);
    res.status(200).json(data);
});

router.post('/authenticate', async (req, res) => {
    try {
        const { data: user, error } = await supabase.from('usersdata').select('*').match(req.body).single();
        if (user) {
            const payload = { _id: user.id, name: user.name, email: user.email };
            jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
                if (err) return res.status(500).json({ message: "Error generating token" });
                res.status(200).json({ token });
            });
        } else {
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const { data: user, error } = await supabase.from('usersdata').select('*').eq('id', req.user.id).single();
        if (error || !user) return res.status(404).json({ message: 'User not found' });
        delete user.password;
        user.role = "user";
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

module.exports = router;