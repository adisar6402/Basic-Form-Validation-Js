const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables from .env file

const app = express();
const port = 6000;

// Use body-parser to parse JSON request body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define Registration Schema and Model for MongoDB
const registrationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});
const Registration = mongoose.model('Registration', registrationSchema);

// Setup nodemailer transporter for sending emails using env variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,  // Use the email from the .env file
    pass: process.env.GMAIL_APP_PASSWORD,   // Use the app password from the .env file
  },
  debug: true,  // Enable debugging for nodemailer to view email sending logs
});

// Registration endpoint to handle POST request
app.post('/submit-registration', (req, res) => {
  const { email, firstName, lastName } = req.body;

  // Save registration to MongoDB
  const registration = new Registration({ email, firstName, lastName });
  registration.save()
    .then(() => {
      const mailOptions = {
        from: process.env.GMAIL_USER,  // Use the email from the .env file
        to: email,
        subject: 'Registration Successful',
        text: `Dear ${firstName} ${lastName},\n\nYour registration was successful!`,
      };

      // Send confirmation email
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Email send error:', error);  // Log full error details
          return res.status(500).send('Failed to send email');
        }
        res.status(200).send('Registration successful. Email sent and saved to database!');
      });
    })
    .catch((err) => {
      res.status(500).send('Failed to save registration to database');
    });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
