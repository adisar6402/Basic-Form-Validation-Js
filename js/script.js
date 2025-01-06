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

// Function to handle form submission (Login or Registration)
async function handleFormSubmit(event, formType) {
    event.preventDefault();
    
    // Show loading indicator
    toggleLoadingIndicator(true);

    // Get form data and trim any leading/trailing whitespace
    const form = event.target;
    const formData = new FormData(form);
    const formObject = Object.fromEntries(formData.entries());
    
    // Validate inputs based on formType
    if (formType === "login") {
        const { email, password } = formObject;

        if (email === "" || password === "") {
            alert("Both email and password are required.");
            toggleLoadingIndicator(false);
            return;
        }

        formObject.action = "login";
    } else if (formType === "registration") {
        const { email, password, confirmPassword } = formObject;

        if (email === "" || password === "" || confirmPassword === "") {
            alert("All fields are required.");
            toggleLoadingIndicator(false);
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            toggleLoadingIndicator(false);
            return;
        }

        // Email format validation
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address.");
            toggleLoadingIndicator(false);
            return;
        }

        formObject.action = "registration";
    }

    try {
        const response = await fetch("/.netlify/functions/form-submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formObject),
        });

        toggleLoadingIndicator(false);

        if (!response.ok) {
            throw new Error(`${formType.charAt(0).toUpperCase() + formType.slice(1)} failed.`);
        }

        const data = await response.json();
        showAlert(formType.charAt(0).toUpperCase() + formType.slice(1));
        console.log(data);
    } catch (error) {
        toggleLoadingIndicator(false);
        alert(`${formType.charAt(0).toUpperCase() + formType.slice(1)} error: ${error.message}`);
    }
}

// Event listener for login form submission
document.getElementById("loginForm").addEventListener("submit", function (event) {
    handleFormSubmit(event, "login");
});

// Event listener for registration form submission
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    handleFormSubmit(event, "registration");
});
