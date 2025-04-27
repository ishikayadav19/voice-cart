const express = require('express');
const Model = require('../models/SellerModels');
const jwt = require('jsonwebtoken'); // import the jwt library
require('dotenv').config(); // import the dotenv library to use environment variables

const router = express.Router();

// POST /seller/signup - Register a new seller
router.post('/add', (req, res) => {
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            if (err?.code === 11000) {
                res.status(400).json({ message: "Seller already registered" });
            } else {
                res.status(500).json({ message: "Some error occurred" });
            }
        });
});

// POST /seller/login - Login seller
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find seller by email
        const seller = await Model.findOne({ email });
        if (!seller) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check password
        if (seller.password !== password) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: seller._id, email: seller.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            seller: {
                id: seller._id,
                name: seller.name,
                email: seller.email,
                storeName: seller.storeName
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Login failed. Please try again." });
    }
});

// GET /seller/getall - Get all sellers
router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /seller/delete/:id - Delete a seller by ID
router.delete('/delete/:id', (req, res) => {
    const { id } = req.params;

    Model.findByIdAndDelete(id)
        .then((deletedSeller) => {
            if (!deletedSeller) {
                return res.status(404).json({ message: 'Seller not found' });
            }
            res.status(200).json({ message: 'Seller deleted successfully', deletedSeller });
        })
        .catch((err) => {
            console.error('Error deleting seller:', err);
            res.status(500).json({ message: 'Failed to delete seller', error: err });
        });
});

module.exports = router;