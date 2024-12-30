const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env

exports.handler = async (event, context) => {
  try {
    // Parse incoming JSON data
    const body = JSON.parse(event.body);

    // Validation
    if (!body.username || !body.password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Username and password are required.' }),
      };
    }

    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    const database = client.db('user-auth');
    const usersCollection = database.collection('users');

    // Check credentials in MongoDB
    const user = await usersCollection.findOne({
      username: body.username,
      password: body.password, // Ideally, the password should be hashed in production!
    });

    if (user) {
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

      // Respond with success
      return {
        statusCode: 200,
        body: JSON.stringify({
          username: user.username,
          message: 'Login successful!',
        }),
      };
    } else {
      // Respond with invalid credentials
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
