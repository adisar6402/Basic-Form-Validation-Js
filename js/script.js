// Function to show an alert
function showAlert(formType) {
    if (formType === 'registration') {
        alert("Registration form submitted!");
    } else if (formType === 'login') {
        alert("Login form submitted!");
    } else {
        alert("Form submitted!");
    }
}

// JavaScript for form validation and submission

// Event listener for the contact form submission
document.getElementById("contactForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Validate the form fields
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (name === "" || email === "" || message === "") {
        alert("All fields are required. Please fill them out.");
        return;
    }

    // Simulate successful submission
    alert("Thank you for reaching out, " + name + "! Your message has been received.");
    // Clear form fields
    document.getElementById("contactForm").reset();
});

// Event listener for the login form submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Validate the form fields
    const loginEmail = document.getElementById("loginEmail").value.trim();
    const loginPassword = document.getElementById("loginPassword").value.trim();

    if (loginEmail === "" || loginPassword === "") {
        alert("Both email and password are required to log in.");
        return;
    }

    // Post the data to the server
    const loginData = {
        email: loginEmail,
        password: loginPassword,
    };

    fetch("/.netlify/functions/form-submit/handle-login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Login failed.");
            }
        })
        .then((data) => {
            alert("Login successful! Welcome back.");
            // Redirect or handle login success
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred during login. Please try again.");
        });
});

// Event listener for the registration form submission
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Validate the form fields
    const regEmail = document.getElementById("regEmail").value.trim();
    const regPassword = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (regEmail === "" || regPassword === "" || confirmPassword === "") {
        alert("All fields are required. Please fill them out.");
        return;
    }

    if (regPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
    }

    // Post the data to the server
    const registrationData = {
        email: regEmail,
        password: regPassword,
    };

    fetch("/.netlify/functions/form-submit/handle-registration", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Registration failed.");
            }
        })
        .then((data) => {
            showAlert('registration');  // Show the alert on successful registration
            alert("Registration successful! You can now log in.");
            // Handle registration success or redirect
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred during registration. Please try again.");
        });
});
