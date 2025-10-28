async function logout() {
    try {
        const response = await fetch('/api/logout', {
            method: 'POST',
        });

        if (response.ok) {
            window.location.href = '/';
        }
    } catch (err) {
        alert('Помилка виходу');
    }
}

async function checkAuth() {
    try {
        const response = await fetch('/api/me');

        if (!response.ok) {
            window.location.href = '/login';
            return;
        }

        const data = await response.json();
        const user = data.user;

        document.getElementById('username').textContent = user.username;
        document.getElementById('userUsername').textContent = user.username;
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('userId').textContent = user._id;

        const createdDate = new Date(user.createdAt);
        document.getElementById('userCreated').textContent =
            createdDate.toLocaleDateString('uk-UA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });

        document.getElementById('loading').style.display = 'none';
        document.getElementById('secretContent').classList.add('active');
    } catch (err) {
        window.location.href = '/login';
    }
}

checkAuth();
