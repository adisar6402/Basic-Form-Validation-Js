const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Use body-parser to parse JSON request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Log important environment variables for debugging
console.log('MongoDB URI:', process.env.MONGODB_URI);
console.log('Gmail User:', process.env.GMAIL_USER);

// Connect to MongoDB with proper error handling
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB successfully!'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    console.error('Ensure the MongoDB URI, credentials, and IP whitelist are correctly configured.');
    process.exit(1); // Exit if MongoDB connection fails
  });

// Enable debug logs for Mongoose
mongoose.set('debug', true);

// Define Registration Schema and Model
const registrationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
const Registration = mongoose.model('Registration', registrationSchema);

// Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Nodemailer verification failed:', error.message);
  } else {
    console.log('Nodemailer is configured and ready to send emails!');
  }
});

// Registration endpoint to handle POST request
app.post('/submit-registration', (req, res) => {
  const { email, firstName, lastName } = req.body;

  // Validate input
  if (!email || !firstName || !lastName) {
    return res.status(400).send('All fields are required.');
  }

  // Save registration to MongoDB
  const registration = new Registration({ email, firstName, lastName });
  registration.save()
    .then(() => {
      console.log('Registration saved to database:', { email, firstName, lastName });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Registration Successful',
        text: `Dear ${firstName} ${lastName},\n\nYour registration was successful!`,
      };

      // Send confirmation email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Failed to send email:', error.message);
          return res.status(500).send('Registration saved, but failed to send confirmation email.');
        }
        console.log('Email sent:', info.response);
        res.status(200).send('Registration successful. Email sent and saved to database!');
      });
    })
    .catch((err) => {
      console.error('Failed to save registration to database:', err.message);
      res.status(500).send('Failed to save registration to database.');
    });
});

// Export Express app as a serverless function for Vercel
module.exports = (req, res) => {
  app(req, res);
};
