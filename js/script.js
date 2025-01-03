// Handle form submission dynamically
async function handleFormSubmit(event, type) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const endpoint =
        type === 'login' ? '/api/handle-login' : '/api/handle-registration';

    try {
        // Show loading indicator
        showLoadingIndicator(true);

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            displayToast(result.error || 'An error occurred', 'error');
        } else {
            displayToast(result.message || 'Success', 'success');
            if (type === 'login') {
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
        // Hide loading indicator
        showLoadingIndicator(false);
    }
}

// Attach event listeners to forms
document.getElementById('loginForm').addEventListener('submit', (e) => handleFormSubmit(e, 'login'));
document.getElementById('registrationForm').addEventListener('submit', (e) => handleFormSubmit(e, 'registration'));

// Utility function: Show/hide loading indicator
function showLoadingIndicator(show) {
    const loader = document.getElementById('loadingIndicator');
    if (loader) {
        loader.style.display = show ? 'block' : 'none';
    }
}

// Utility function: Display toast message
function displayToast(message, type) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerText = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}
