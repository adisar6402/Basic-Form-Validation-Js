// Function to show an alert
function showAlert(formType) {
    alert(`${formType} form submitted successfully!`);
}

// Function to show or hide the loading indicator
function toggleLoadingIndicator(show) {
    const loadingIndicator = document.getElementById("loadingIndicator");
    if (loadingIndicator) {
        loadingIndicator.style.display = show ? "block" : "none";
    }
}

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Show loading indicator
    toggleLoadingIndicator(true);

    const loginEmail = document.getElementById("loginEmail").value.trim();
    const loginPassword = document.getElementById("loginPassword").value.trim();

    if (loginEmail === "" || loginPassword === "") {
        alert("Both email and password are required.");
        toggleLoadingIndicator(false);
        return;
    }

    const loginData = {
        action: "login",
        email: loginEmail,
        password: loginPassword,
    };

    fetch("/.netlify/functions/form-submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
    })
        .then((response) => {
            toggleLoadingIndicator(false);
            if (!response.ok) {
                throw new Error("Login failed.");
            }
            return response.json();
        })
        .then((data) => {
            showAlert("Login");
            console.log(data);
        })
        .catch((error) => {
            alert("Error during login: " + error.message);
        });
});

// Event listener for registration form submission
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Show loading indicator
    toggleLoadingIndicator(true);

    const regEmail = document.getElementById("regEmail").value.trim();
    const regPassword = document.getElementById("regPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    if (regEmail === "" || regPassword === "" || confirmPassword === "") {
        alert("All fields are required.");
        toggleLoadingIndicator(false);
        return;
    }

    if (regPassword !== confirmPassword) {
        alert("Passwords do not match.");
        toggleLoadingIndicator(false);
        return;
    }

    // Email format validation
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(regEmail)) {
        alert("Please enter a valid email address.");
        toggleLoadingIndicator(false);
        return;
    }

    const registrationData = {
        action: "registration",
        email: regEmail,
        password: regPassword,
    };

    fetch("/.netlify/functions/form-submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
    })
        .then((response) => {
            toggleLoadingIndicator(false);
            if (!response.ok) {
                throw new Error("Registration failed.");
            }
            return response.json();
        })
        .then((data) => {
            showAlert("Registration");
            console.log(data);
        })
        .catch((error) => {
            alert("Error during registration: " + error.message);
        });
});
