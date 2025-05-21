document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Aqui você pode adicionar a lógica de autenticação real
    // Por enquanto, vamos apenas simular um login
    if (username === 'admin' && password === 'admin') {
        // Salva o estado de login
        localStorage.setItem('isLoggedIn', 'true');
        // Redireciona para o dashboard
        window.location.href = 'dashboard.html';
    } else {
        alert('Usuário ou senha inválidos!');
    }
}); 