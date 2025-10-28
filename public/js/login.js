const form = document.getElementById('loginForm');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorDiv.classList.remove('active');
    successDiv.classList.remove('active');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Обробка...';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            successDiv.textContent = '✓ ' + data.message;
            successDiv.classList.add('active');

            setTimeout(() => {
                window.location.href = '/secret';
            }, 1000);
        } else {
            errorDiv.textContent = '✗ ' + data.error;
            errorDiv.classList.add('active');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Увійти';
        }
    } catch (err) {
        errorDiv.textContent = "✗ Помилка з'єднання з сервером";
        errorDiv.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Увійти';
    }
});
