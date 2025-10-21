import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importar Link

function RegisterPage() {
  // States para guardar os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // State para guardar mensagens de erro da API
  const [error, setError] = useState('');

  // Hook para navegar entre as páginas
  const navigate = useNavigate();

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    setError(''); // Limpa erros anteriores

    try {
      // Faz a requisição POST para o nosso endpoint de cadastro
      const response = await axios.post('http://127.0.0.1:5000/register', {
        email: email,
        password: password
      });

      // Se o cadastro for bem-sucedido...
      console.log('Cadastro realizado:', response.data);

      // Redireciona o usuário para a página de login
      navigate('/login');

    } catch (err) {
      // Se a API retornar um erro (ex: email já existe)...
      console.error('Erro no cadastro:', err);

      // Pega a mensagem de erro da resposta da API e a exibe na tela
      if (err.response && err.response.data) {
        setError(err.response.data.erro);
      } else {
        setError('Ocorreu um erro ao tentar se cadastrar.');
      }
    }
  };

  return (
    <div>
      <h1>Cadastro</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Exibe a mensagem de erro, se houver uma */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" style={{ marginTop: '20px' }}>Cadastrar</button>
      </form>

      {/* Link para a página de login */}
      <p>
        Já tem uma conta? <Link to="/login">Faça login</Link>
      </p>
    </div>
  );
}

export default RegisterPage;