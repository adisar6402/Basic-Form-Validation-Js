// handleRegistration.js
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');
require('dotenv').config();  // To access .env variables

// Create a transporter object using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  }
});

exports.handler = async (event, context) => {
  try {
    // Parse incoming data
    const body = JSON.parse(event.body);

    // Validation
    if (!body.username || !body.password || !body.email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields (username, password, email) are required.' }),
      };
    }

    // Prepare email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Sending email to yourself for the admin
      subject: 'New Registration Form Submission',
      text: `New Registration Details:
      Username: ${body.username}
      Email: ${body.email}
      Password: ${body.password}`,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Connect to MongoDB and insert the data
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();

    const database = client.db('form-submissions'); // Use or create the "form-submissions" database
    const submissions = database.collection('registrations');
    
    // Store form submission in the database
    await submissions.insertOne({
      username: body.username,
      email: body.email,
      password: body.password, // You may want to hash the password in production
      submittedAt: new Date(),
    });

    // Respond with success message
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registration successful and stored!' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred. Please try again later.' }),
    };
  }
};
