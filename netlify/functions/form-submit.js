const { MongoClient } = require('mongodb');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                "X-Content-Type-Options": "nosniff",  // Adding this header for security
            },
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    const path = event.path;
    const data = JSON.parse(event.body);

    let client;
    try {
        client = new MongoClient(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000,
        });
        await client.connect();
        const database = client.db('user-auth');
        const usersCollection = database.collection('users');

        if (path.includes('handle-registration')) {
            const validationError = validateRegistrationForm(data);
            if (validationError) {
                return {
                    statusCode: 400,
                    headers: {
                        "X-Content-Type-Options": "nosniff",  // Adding this header for validation response
                    },
                    body: JSON.stringify(validationError),
                };
            }

            const existingUser = await usersCollection.findOne({ email: data.email });
            if (existingUser) {
                return {
                    statusCode: 409,
                    headers: {
                        "X-Content-Type-Options": "nosniff",  // Adding this header for error response
                    },
                    body: JSON.stringify({ field: 'email', message: 'User already exists.' }),
                };
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            await usersCollection.insertOne({ ...data, password: hashedPassword });

            return {
                statusCode: 201,
                headers: {
                    "X-Content-Type-Options": "nosniff",  // Adding this header for success response
                },
                body: JSON.stringify({ message: 'Registration successful.' }),
            };
        }

        if (path.includes('handle-login')) {
            const user = await usersCollection.findOne({ email: data.email });
            if (!user || !(await bcrypt.compare(data.password, user.password))) {
                return {
                    statusCode: 401,
                    headers: {
                        "X-Content-Type-Options": "nosniff",  // Adding this header for login failure
                    },
                    body: JSON.stringify({ field: 'email', message: 'Invalid credentials.' }),
                };
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            });

            const mailOptions = {
                from: process.env.GMAIL_USER,
                to: process.env.GMAIL_USER,
                subject: 'User Login Notification',
                text: `User ${user.email} logged in successfully.`,
            };
            await transporter.sendMail(mailOptions);

            return {
                statusCode: 200,
                headers: {
                    "X-Content-Type-Options": "nosniff",  // Adding this header for login success
                },
                body: JSON.stringify({ message: 'Login successful.' }),
            };
        }

        return {
            statusCode: 404,
            headers: {
                "X-Content-Type-Options": "nosniff",  // Adding this header for invalid route error
            },
            body: JSON.stringify({ error: 'Invalid route.' }),
        };
    } catch (error) {
        console.error('Error:', error.message);
        return {
            statusCode: 500,
            headers: {
                "X-Content-Type-Options": "nosniff",  // Adding this header for internal error
            },
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    } finally {
        if (client) {
            client.close();
        }
    }
};

function validateRegistrationForm(data) {
    const { firstName, lastName, email, password, confirmPassword, country, terms } = data;

    if (!firstName || !lastName || !email || !password || !confirmPassword || !country) {
        return { field: 'all', message: 'Please fill in all fields.' };
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
        return { field: 'email', message: 'Please enter a valid email address.' };
    }

    if (password.length < 8) {
        return { field: 'password', message: 'Password must be at least 8 characters long.' };
    }

    if (password !== confirmPassword) {
        return { field: 'password', message: 'Passwords do not match.' };
    }

    if (!terms) {
        return { field: 'terms', message: 'Please agree to the Terms and Conditions.' };
    }

    return null;
}
