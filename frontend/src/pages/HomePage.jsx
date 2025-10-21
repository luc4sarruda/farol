import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ListaMetas from '../components/ListaMetas';
import FormularioMeta from '../components/FormularioMeta';

// Não precisamos mais do 'useNavigate' aqui, pois a navegação
// após o logout será cuidada automaticamente pelo ProtectedRoute.

function HomePage() {
  // Pegamos o usuário e a função de logout do nosso contexto global.
  const { user, logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      // A única responsabilidade deste botão é MUDAR O ESTADO,
      // ou seja, dizer à aplicação para deslogar o usuário.
      await logout();
      
      // O componente ProtectedRoute vai ver que o 'user' se tornou nulo
      // e vai CUIDAR DO REDIRECIONAMENTO para a página de login.
    } catch (error) {
      console.error("Ocorreu um erro ao fazer logout:", error);
    }
  };

  return (
    <div>
      <header style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '20px' 
      }}>
        {/* Usamos 'user?.email' como uma segurança caso o objeto 'user' ainda não tenha carregado */}
        <h2>Farol de {user?.email}</h2>
        <button onClick={handleLogout}>Sair</button>
      </header>
      
      <main>
        <h3>Minhas Metas</h3>
        <FormularioMeta />
        <ListaMetas />
      </main>
    </div>
  );
}

export default HomePage;