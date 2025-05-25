import express from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.static('public'));
app.use(express.json());

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS
    }
});

// API endpoint for subscription
app.post('/api/subscribe', async (req, res) => {
    try {
        const { name, email, organization } = req.body;

        // Validate input
        if (!name || !email) {
            return res.status(400).json({ success: false, message: 'Name and email are required' });
        }

        // Create subscriber object with timestamp
        const subscriber = {
            name,
            email,
            organization: organization || 'Not specified',
            timestamp: new Date().toISOString()
        };

        // In a production app, you would save to a database here
        console.log('New subscriber:', subscriber);

        // Send notification email to team
        const mailOptions = {
            from: `HybridOps Notifications <${process.env.GMAIL_USER}>`,
            to: process.env.TEAM_EMAIL || process.env.GMAIL_USER,
            subject: 'New Signup from HybridOps',
            html: `
        <h2>New HybridOps Signup!</h2>
        <p>A new user has joined the waitlist:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Organization:</strong> ${organization || 'Not specified'}</li>
          <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        </ul>
      `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        // Optional: Send confirmation to user
        if (process.env.SEND_USER_CONFIRMATION === 'true') {
            const userMailOptions = {
                from: `HybridOps <${process.env.GMAIL_USER}>`,
                to: email,
                subject: 'Welcome to HybridOps Waitlist',
                html: `
          <h2>Welcome to HybridOps!</h2>
          <p>Hi ${name},</p>
          <p>Thank you for joining our waitlist! We're excited to have you on board.</p>
          <p>We'll keep you updated on our progress and notify you when we launch.</p>
          <p>Best regards,<br>The HybridOps Team</p>
        `
            };

            await transporter.sendMail(userMailOptions);
        }

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error('Error processing subscription:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.'
        });
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});