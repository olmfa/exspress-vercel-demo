const form = document.getElementById('registerForm');
const errorDiv = document.getElementById('error');
const successDiv = document.getElementById('success');
const submitBtn = document.getElementById('submitBtn');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    errorDiv.classList.remove('active');
    successDiv.classList.remove('active');

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        errorDiv.textContent = '✗ Паролі не співпадають';
        errorDiv.classList.add('active');
        return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Обробка...';

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
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
            submitBtn.textContent = 'Зареєструватись';
        }
    } catch (err) {
        errorDiv.textContent = "✗ Помилка з'єднання з сервером";
        errorDiv.classList.add('active');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Зареєструватись';
    }
});
