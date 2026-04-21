import React, { useState } from 'react';
import axios from 'axios';

function FormularioMeta() {
  // 'useState' para guardar o texto que o usuário digita no campo
  const [texto, setTexto] = useState('');

  // Esta função será chamada quando o formulário for enviado
  const handleSubmit = (event) => {
    // Impede o comportamento padrão do formulário, que é recarregar a página
    event.preventDefault();

    // Se o campo de texto estiver vazio, não faz nada
    if (!texto.trim()) return;

    // Envia os dados para o nosso backend usando o método POST
    axios.post('http://127.0.0.1:5000/metas', { texto: texto })
      .then(() => {
        setTexto('');
        window.location.reload(); 
      })
      .catch(error => console.error("Erro:", error));
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-4">
      <input 
        type="text" 
        value={texto} 
        onChange={e => setTexto(e.target.value)} 
        placeholder="Qual o próximo passo no seu rumo?" 
        className="flex-1 bg-azul-noturno/50 border border-white/10 rounded-xl px-6 py-4 focus:outline-none focus:border-dourado-farol/50 focus:ring-1 focus:ring-dourado-farol/50 transition-all text-white placeholder:text-cinza-suave"
      />
      <button 
        type="submit"
        className="bg-dourado-farol text-azul-noturno px-8 py-4 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-glow"
      >
        Iluminar
      </button>
    </form>
  );
};

export default FormularioMeta;