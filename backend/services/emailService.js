const nodemailer = require('nodemailer');

// Debug environment variables
console.log('Email Configuration:', {
    user: process.env.EMAIL_USER,
    hasPassword: !!process.env.EMAIL_PASSWORD
});

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Verify transporter configuration
transporter.verify(function(error, success) {
    if (error) {
        console.log('Transporter verification failed:', error);
    } else {
        console.log('Server is ready to take our messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
            throw new Error('Email configuration is missing. Please check your .env file.');
        }

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html
        };

        console.log('Attempting to send email to:', to);
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.response);
        return { success: true, message: 'Email sent successfully' };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email', error: error.message };
    }
};

// Function to send order confirmation email
const sendOrderConfirmationEmail = async (userEmail, orderDetails) => {
    const subject = 'Order Confirmation - Voice Cart';
    const text = `Thank you for your order! Your order has been confirmed.`;
    const html = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Order Confirmation</h2>
            <p>Dear Customer,</p>
            <p>Thank you for your order! Your order has been confirmed.</p>
            <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px;">
                <h3 style="color: #444;">Order Details:</h3>
                <p><strong>Order ID:</strong> ${orderDetails.orderId}</p>
                <p><strong>Total Amount:</strong> &#8377;${orderDetails.totalAmount}</p>
                <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
            </div>
            <p>We will process your order shortly.</p>
            <p>Best regards,<br>Voice Cart Team</p>
        </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
};

module.exports = {
    sendEmail,
    sendOrderConfirmationEmail
}; 