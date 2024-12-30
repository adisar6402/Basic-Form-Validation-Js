// Helper function to validate the registration form
function validateRegistrationForm(data) {
    // Destructure data for easier validation
    const { firstName, lastName, email, password, confirmPassword, country, terms } = data;

    // Validate all required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !country) {
        return 'Please fill in all fields.';
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
        return 'Please enter a valid email address.';
    }

    // Validate password length
    if (password.length < 8) {
        return 'Password must be at least 8 characters long.';
    }

    // Validate passwords match
    if (password !== confirmPassword) {
        return 'Passwords do not match.';
    }

    // Validate "Terms and Conditions" checkbox
    if (!terms) {
        return 'Please agree to the Terms and Conditions.';
    }

    return null; // Validation passed
}

// Event listener for registration form submission
document.getElementById('registrationForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    // Include the terms checkbox explicitly
    data.terms = document.getElementById('terms').checked;

    // Validate form data
    const error = validateRegistrationForm(data);
    if (error) {
        alert(error);
        return;
    }

    const registrationEndpoint = '/submit-registration';

    try {
        const response = await fetch(registrationEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Registration successful!');
            event.target.reset();
        } else {
            const errorData = await response.json();
            alert(`Registration failed: ${errorData.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error during registration submission:', error);
        alert('An error occurred while submitting the registration form.');
    }
});

// Event listener for login form submission
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

    const loginEndpoint = '/submit-login';

    try {
        const response = await fetch(loginEndpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            alert('Login successful!');
            event.target.reset();
        } else {
            const errorData = await response.json();
            alert(`Login failed: ${errorData.message || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Error during login submission:', error);
        alert('An error occurred while submitting the login form.');
    }
});
