const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { MongoClient } = require('mongodb');
require('dotenv').config(); // To access .env variables

// Create a transporter object using Gmail's SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

exports.handler = async (event, context) => {
  try {
    // Parse incoming data
    const body = JSON.parse(event.body);
    console.log('Received data:', body); // Log the incoming data for debugging

    // Validation
    if (!body.username || !body.password || !body.email) {
      console.error('Validation failed:', body);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'All fields (username, password, email) are required.' }),
      };
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(body.password, 10);
    console.log('Password hashed:', hashedPassword);

    // Prepare email content
    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send email to admin
      subject: 'New Registration Form Submission',
      text: `New Registration Details:
      Username: ${body.username}
      Email: ${body.email}
      Password: ${hashedPassword}`, // Sending hashed password for reference
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully.');

    // Connect to MongoDB and insert the data
    const client = new MongoClient(process.env.MONGODB_URI);
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('MongoDB connected.');

    const database = client.db('form-submissions');
    const submissions = database.collection('registrations');
    
    // Store form submission in the database
    await submissions.insertOne({
      username: body.username,
      email: body.email,
      password: hashedPassword,
      submittedAt: new Date(),
    });
    console.log('Data saved in MongoDB.');

    // Respond with success message
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Registration successful and stored!' }),
    };
  } catch (error) {
    console.error('Error:', error); // Enhanced error logging
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred. Please try again later.' }),
    };
  }
};
