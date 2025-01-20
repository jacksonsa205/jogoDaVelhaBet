document.getElementById('cadastro-form').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita o comportamento padrão do formulário

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/users/cadastra-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            // Exibe a notificação
            document.getElementById('result').textContent = 'Usuário cadastrado com sucesso!';
            
            // Aguarda 2 segundos e redireciona para a página inicial
            setTimeout(() => {
                window.location.href = '/';
            }, 2000);
        } else {
            // Exibe o erro caso não seja bem-sucedido
            document.getElementById('result').textContent = `Erro: ${data.error}`;
        }
    } catch (err) {
        console.error('Erro ao cadastrar usuário:', err);
        document.getElementById('result').textContent = 'Erro ao cadastrar usuário. Tente novamente.';
    }
});
