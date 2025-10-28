document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');
    const errorDiv = document.getElementById('error');
    const successDiv = document.getElementById('success');

    // Очистка повідомлень
    errorDiv.textContent = '';
    successDiv.textContent = '';
    errorDiv.style.display = 'none';
    successDiv.style.display = 'none';

    // Отримання даних форми
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Валідація
    if (!email || !password) {
        errorDiv.textContent = "Всі поля обов'язкові";
        errorDiv.style.display = 'block';
        return;
    }

    // Блокуємо кнопку
    submitBtn.disabled = true;
    submitBtn.textContent = 'Вхід...';

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // ВАЖЛИВО для cookies
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            successDiv.textContent = 'Успішний вхід! Перенаправлення...';
            successDiv.style.display = 'block';

            // Затримка для показу повідомлення
            setTimeout(() => {
                window.location.href = '/secret';
            }, 1000);
        } else {
            errorDiv.textContent = data.error || 'Помилка входу';
            errorDiv.style.display = 'block';
            submitBtn.disabled = false;
            submitBtn.textContent = 'Увійти';
        }
    } catch (error) {
        console.error('Login error:', error);
        errorDiv.textContent = "Помилка з'єднання з сервером";
        errorDiv.style.display = 'block';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Увійти';
    }
});
