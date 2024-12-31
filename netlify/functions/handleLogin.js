const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config(); // Load environment variables from .env

exports.handler = async (event, context) => {
  try {
    // Parse incoming JSON data
    const body = JSON.parse(event.body);
    console.log('Received login request:', body); // Log incoming data for debugging

    // Validation
    if (!body.username || !body.password) {
      console.error('Missing required fields for login:', body);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username and password are required.' }),
      };
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('MongoDB connected.');

    const database = client.db('user-auth');
    const usersCollection = database.collection('users');

    // Find user in database
    const user = await usersCollection.findOne({ username: body.username });
    console.log('User found:', user ? true : false); // Log if the user exists

    if (user && await bcrypt.compare(body.password, user.password)) {
      console.log('Login successful for user:', user.username);

      // If user exists, send a success email
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const mailOptions = {
        from: process.env.GMAIL_USER,
        to: process.env.GMAIL_USER, // Send the notification to yourself (admin)
        subject: 'User Login Notification',
        text: `User ${user.username} logged in successfully on ${new Date().toLocaleString()}`,
      };

      await transporter.sendMail(mailOptions);
      console.log('Login success email sent.');

      // Respond with success
      return {
        statusCode: 200,
        body: JSON.stringify({
          username: user.username,
          message: 'Login successful!',
        }),
      };
    } else {
      console.warn('Invalid credentials');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid credentials.' }),
      };
    }
  } catch (error) {
    console.error('Login error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An error occurred. Please try again later.' }),
    };
  }
};
