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

// Function to show or hide the loading indicator
function toggleLoadingIndicator(show) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? "block" : "none";
    }
}

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

    // Show loading indicator
    toggleLoadingIndicator(true);

    // Validate the form fields
    const loginEmail = document.getElementById("loginEmail").value.trim();
    const loginPassword = document.getElementById("loginPassword").value.trim();

    if (loginEmail === "" || loginPassword === "") {
        alert("Both email and password are required to log in.");
        toggleLoadingIndicator(false); // Hide loading indicator
        return;
    }

    // Post the data to the server as JSON
    const loginData = {
        email: loginEmail,
        password: loginPassword,
    };

    fetch("/.netlify/functions/form-submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'login', ...loginData })
    })
        .then((response) => {
            toggleLoadingIndicator(false); // Hide loading indicator
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Login failed. Invalid credentials or server error.");
            }
        })
        .then((data) => {
            showAlert('login');
            alert("Login successful! Welcome back.");
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred during login. Please try again.");
        });
});

// Event listener for the registration form submission
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission

    // Show loading indicator
    toggleLoadingIndicator(true);

    // Validate the form fields
    const regEmail = document.getElementById("regEmail").value.trim();
    const regPassword = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (regEmail === "" || regPassword === "" || confirmPassword === "") {
        alert("All fields are required. Please fill them out.");
        toggleLoadingIndicator(false); // Hide loading indicator
        return;
    }

    if (regPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        toggleLoadingIndicator(false); // Hide loading indicator
        return;
    }

    // Post the data to the server as JSON
    const registrationData = {
        email: regEmail,
        password: regPassword,
    };

    fetch("/.netlify/functions/form-submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: 'registration', ...registrationData })
    })
        .then((response) => {
            toggleLoadingIndicator(false); // Hide loading indicator
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("Registration failed. Email may already be in use.");
            }
        })
        .then((data) => {
            showAlert('registration');
            alert("Registration successful! You can now log in.");
        })
        .catch((error) => {
            console.error(error);
            alert("An error occurred during registration. Please try again.");
        });
});
