import React, { useState, useContext } from 'react'; // importar useContext
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // importar o AuthContext

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Pegar a função login do contexto

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await login(email, password); // USAR A FUNÇÃO DO CONTEXTO
      navigate('/'); // Redirecionar após o sucesso
    } catch (err) {
      setError(err.response?.data?.erro || 'Ocorreu um erro ao tentar fazer login.');
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        {/* O formulário continua igual... */}
        <div>
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div style={{ marginTop: '10px' }}>
          <label>Senha:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit" style={{ marginTop: '20px' }}>Entrar</button>
      </form>
      <p>Não tem uma conta? <Link to="/register">Cadastre-se</Link></p>
    </div>
  );
}

export default LoginPage;