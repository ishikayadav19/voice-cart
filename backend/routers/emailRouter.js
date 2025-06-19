const express = require('express');
const router = express.Router();
const { sendEmail, sendOrderConfirmationEmail } = require('../services/emailService');

// Route to verify email configuration
router.get('/verify-config', (req, res) => {
    const emailConfig = {
        emailUser: process.env.EMAIL_USER ? 'Configured' : 'Not configured',
        emailPassword: process.env.EMAIL_PASSWORD ? 'Configured' : 'Not configured'
    };
    res.json(emailConfig);
});

// Route to send a test email
router.post('/test', async (req, res) => {
    try {
        const { to, subject, text } = req.body;
        const result = await sendEmail(to, subject, text);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send email', error: error.message });
    }
});

// Route to send order confirmation email
router.post('/order-confirmation', async (req, res) => {
    try {
        const { userEmail, orderDetails } = req.body;
        const result = await sendOrderConfirmationEmail(userEmail, orderDetails);
        res.json(result);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send order confirmation email', error: error.message });
    }
});

module.exports = router; 