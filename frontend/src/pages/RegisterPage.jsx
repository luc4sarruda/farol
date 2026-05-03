import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Importar Link

function RegisterPage() {
  // States para guardar os dados do formulário
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  // State para guardar mensagens de erro da API
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // Hook para navegar entre as páginas
  const navigate = useNavigate();

  // Função chamada quando o formulário é enviado
  const handleSubmit = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página
    setError(''); // Limpa erros anteriores

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    
    try {
      // Enviando apenas email e senha (renomeado para 'senha' para casar com o backend)
      await axios.post('http://127.0.0.1:5000/register', { 
        email, 
        password: password 
      });
      
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.erro || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050810] relative overflow-hidden px-4 py-8">
      
      {/* Luzes de fundo */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-dourado-farol/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-azul-noturno/50 rounded-full blur-[120px]" />

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 p-10 rounded-[2.5rem] backdrop-blur-2xl shadow-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-dourado-farol/20 to-transparent border border-dourado-farol/20 mb-6">
             <span className="text-3xl filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]">⚓</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            NOVA CONTA
          </h1>
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em] font-bold">
            Acenda o farol  (Tim Maia reference)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Campo E-mail */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
              E-mail
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              placeholder="seu@email.com"
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-dourado-farol/40 transition-all placeholder:text-white/10 text-sm"
            />
          </div>

          {/* Campo Senha */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
              Senha
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className="w-full bg-black/20 border border-white/5 rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-dourado-farol/40 transition-all placeholder:text-white/10 text-sm"
            />
          </div>

          {/* 3. NOVO CAMPO: CONFIRMAR SENHA */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em] ml-1">
              Confirmar Senha
            </label>
            <input 
              type="password" 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              placeholder="••••••••"
              className={`w-full bg-black/20 border rounded-2xl px-5 py-4 text-white focus:outline-none transition-all placeholder:text-white/10 text-sm
                ${confirmPassword && password !== confirmPassword 
                  ? 'border-red-500/50' 
                  : 'border-white/5 focus:border-dourado-farol/40'}`}
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] p-4 rounded-xl text-center">
              {error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full font-black py-4 rounded-2xl transition-all shadow-lg uppercase tracking-widest text-xs flex items-center justify-center
              ${isLoading 
                ? 'bg-white/10 cursor-not-allowed text-white/30' 
                : 'bg-white text-azul-noturno shadow-[0_10px_20px_rgba(255,255,255,0.1)] hover:bg-dourado-farol hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-[0.98]'}`}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Criando Conta...</span>
              </div>
            ) : (
              "Confirmar Cadastro"
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[11px] text-white/20 uppercase tracking-widest">
          Já tem uma conta?{' '}
          <Link to="/login" className="text-dourado-farol font-bold hover:text-white transition-colors">
            Fazer Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;