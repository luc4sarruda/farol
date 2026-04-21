import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import ListaMetas from '../components/ListaMetas';
import FormularioPorto from '../components/FormularioPorto';

function HomePage() {
  // Pegamos o usuário e a função de logout do nosso contexto global.
  const { user, logout } = useContext(AuthContext);
  const [metas, setMetas] = useState([]);

  const fetchMetas = useCallback(() => {
    if (user) {
      axios.get('http://127.0.0.1:5000/metas')
        .then(response => { setMetas(response.data); })
        .catch(error => {
          console.error("Erro ao buscar metas:", error);
          setMetas([]);
        });
    } else {
      setMetas([]);
    }
  }, [user]);

  useEffect(() => {
    fetchMetas();
  }, [fetchMetas]);
        
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
          onClick={handleLogout}
          className="px-5 py-2 border border-dourado-farol/30 text-dourado-farol rounded-lg hover:bg-dourado-farol hover:text-azul-noturno transition-all duration-300 font-semibold text-sm"
        >
          Sair
        </button>
      </header>

      <main className="space-y-12">
        {/* Seção de Entrada - Agora focada no Porto Seguro */}
        <section className="bg-white/5 p-8 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            {/* Um ícone sutil para dar peso visual ao Porto Seguro */}
            <span className="text-2xl">⚓</span>
            <h2 className="text-xl font-semibold text-white/90">Estabelecer Novo Porto Seguro</h2>
          </div>
  
          <FormularioPorto onPortoAdicionado={fetchMetas} />
        </section>

        {/* Seção de Lista */}
        <section>
          <ListaMetas metas={metas} />
        </section>
      </main>
    </div>
  );
}

export default HomePage;