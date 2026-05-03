import React, { useState, useContext } from 'react'; // importar useContext
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // importar o AuthContext

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Pegar a função login do contexto

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true); // 1. Começa o carregamento

    try {
      await login(email, password);
      navigate('/'); 
    } catch (err) {
      setError(err.response?.data?.erro || 'Credenciais inválidas.');
    } finally {
      setIsLoading(false); // 2. Termina o carregamento (sucesso ou erro)
    }
  };

  return (
    /* 1. CONTAINER COM GRADIENTE RADIAL (O "MAR NOTURNO") */
    <div className="min-h-screen flex items-center justify-center bg-[#050810] relative overflow-hidden px-4">
      
      {/* Efeito de luz ambiente no fundo (A lanterna do farol ao longe) */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-dourado-farol/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-azul-noturno/50 rounded-full blur-[120px]" />

      {/* 2. O CARD COM GLASSMORPHISM REFORÇADO */}
      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative z-10">
        
        {/* Ícone com Brilho Próprio */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-dourado-farol/20 to-transparent border border-dourado-farol/20 mb-6 shadow-[0_0_30px_rgba(212,175,55,0.1)]">
            <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">⚓</span>
          </div>
          <h1 className="text-5xl font-black text-white tracking-tighter mb-2">
            FAROL
          </h1>
          <p className="text-white/30 text-xs uppercase tracking-[0.3em] font-bold">
            Navegue pelas suas metas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
              EMAIL
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="seu@porto.com"
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-dourado-farol/40 focus:bg-black/40 transition-all placeholder:text-white/10 text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
              SENHA
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-dourado-farol/40 focus:bg-black/40 transition-all placeholder:text-white/10 text-sm"
            />
          </div>

          {error && (
            <div className="bg-red-500/5 border border-red-500/20 text-red-400 text-[11px] p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          {/* 3. BOTÃO COM EFEITO DE "GLOW" (O PONTO DE LUZ) */}
          <button 
            type="submit" 
            disabled={isLoading} // Desabilita para evitar cliques duplos
            className={`w-full text-azul-noturno font-black py-4 rounded-2xl transition-all 
                      active:scale-[0.98] shadow-lg uppercase tracking-widest text-xs flex items-center justify-center
                      ${isLoading 
                        ? 'bg-dourado-farol/50 cursor-not-allowed' 
                        : 'bg-dourado-farol hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] shadow-dourado-farol/20'}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-azul-noturno/30 border-t-azul-noturno rounded-full animate-spin" />
                <span>Autenticando...</span>
              </div>
            ) : (
              "Ancorar Agora"
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-[11px] text-white/20 uppercase tracking-widest">
          Novo por aqui?{' '}
          <Link to="/register" className="text-dourado-farol font-bold hover:text-white transition-colors">
            Crie sua conta
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;