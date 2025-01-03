// Handle form submission dynamically
async function handleFormSubmit(event, formType) {
    event.preventDefault(); // Prevent default form submission

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Define API endpoint dynamically based on form type
    const endpoint = formType === 'login' ? '/api/handle-login' : '/api/form-submit';

    try {
        // Show loading indicator while submitting
        showLoadingIndicator(true);

        // Make a POST request to the endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        // Handle server response
        if (!response.ok) {
            displayToast(result.error || 'An error occurred', 'error');
        } else {
            displayToast(result.message || 'Success', 'success');
            if (formType === 'login') {
                console.log('Logged in successfully!');
                // Redirect after login success if needed
                window.location.href = '/dashboard';
            } else {
                console.log('Registered successfully!');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        displayToast('Something went wrong. Please try again.', 'error');
    } finally {
        // Hide loading indicator after submission
        showLoadingIndicator(false);
    }
}

// Attach event listeners to forms and prevent default actions
document.getElementById('loginForm')?.addEventListener('submit', (e) => handleFormSubmit(e, 'login'));
document.getElementById('registrationForm')?.addEventListener('submit', (e) => handleFormSubmit(e, 'registration'));

// Utility function: Show/hide loading indicator
function showLoadingIndicator(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

// Utility function: Display toast message to notify users
function displayToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
