// script.js

// Handle user login
function handleLogin() {
    // Get input values
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Perform login logic (this could be an API request or form validation)
    if (username === '' || password === '') {
        alert('Please fill in both username and password');
        return;
    }

    // Simulating login success (replace with actual logic)
    alert('Login successful!');
    console.log('Username:', username);
    console.log('Password:', password); // Never log password in production
}

// Handle user registration
function handleRegistration() {
    // Get input values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Perform registration validation
    if (name === '' || email === '' || password === '' || confirmPassword === '') {
        alert('Please fill in all fields');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    // Simulating registration success (replace with actual logic)
    alert('Registration successful!');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Password:', password); // Never log password in production
}

// Optional: You can use this to validate password strength
function validatePasswordStrength(password) {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // Example: Minimum 6 characters, at least one letter and one number
    return regex.test(password);
}

// Optional: Additional validation or helper functions can go here
