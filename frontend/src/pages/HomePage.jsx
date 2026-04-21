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
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header com efeito de vidro */}
      <header className="flex justify-between items-center p-6 mb-12 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl">
        <div>
          <h1 className="text-3xl font-bold text-dourado-farol drop-shadow-glow">
            Farol
          </h1>
          <p className="text-cinza-suave text-sm mt-1">
            Rumo de: <span className="text-white font-medium">{user?.email}</span>
          </p>
        </div>
        
        <button 
          onClick={() => logout()}
          className="px-5 py-2 border border-dourado-farol/30 text-dourado-farol rounded-lg hover:bg-dourado-farol hover:text-azul-noturno transition-all duration-300 font-semibold text-sm"
        >
          Sair
        </button>
      </header>

      <main className="space-y-12">
        {/* Seção de Entrada */}
        <section className="bg-white/5 p-8 rounded-3xl border border-white/5">
          <h2 className="text-xl font-semibold mb-6 text-white/90">Novo Ponto de Luz</h2>
          <FormularioMeta />
        </section>

        {/* Seção de Lista */}
        <section>
          <ListaMetas />
        </section>
      </main>
    </div>
  );
}

export default HomePage;