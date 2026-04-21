import React, { useState, useEffect, useContext } from 'react'; // 1. Importar useContext
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 2. Importar nosso AuthContext


function ListaMetas({ metas, onUpdate }) {
  // Estado local para controlar o texto do novo ponto por ID de porto
  const [novoPonto, setNovoPonto] = useState({});

  const handleAddPonto = async (portoId) => {
    const texto = novoPonto[portoId];
    if (!texto || !texto.trim()) return;

    try {
      await axios.post(`http://127.0.0.1:5000/metas/${portoId}/pontos`, {
        texto: texto
      });
      
      // Limpamos apenas o input deste card específico
      setNovoPonto({ ...novoPonto, [portoId]: '' });
      
      // Notificamos o componente pai (HomePage) para atualizar os dados
      onUpdate(); 
    } catch (error) {
      console.error("Erro ao acender ponto de luz:", error);
    }
  };

  const handleTogglePonto = async (pontoId) => {
    try {
      await axios.patch(`http://127.0.0.1:5000/pontos/${pontoId}/toggle`);
      onUpdate(); // Atualiza a lista para refletir a mudança
    } catch (error) {
      console.error("Erro ao alternar status do ponto:", error);
    }
  };

  return (
    <div className="grid gap-6">
      {metas.map((porto) => (
        <div key={porto.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-dourado-farol/20 transition-all group">
          {/* Cabeçalho do Porto Seguro */}
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-dourado-farol transition-colors">
              {porto.texto}
            </h3>
          </div>

          {porto.descricao && (
            <p className="text-cinza-suave text-sm mb-6">{porto.descricao}</p>
          )}

          {/* LISTAGEM DOS PONTOS DE LUZ (Submetas) */}
          <div className="space-y-3 mb-6">
            {porto.pontos_de_luz?.map((ponto) => (
              <div 
                key={ponto.id} 
                onClick={() => handleTogglePonto(ponto.id)}
                className="flex items-center gap-3 text-sm cursor-pointer group/ponto"
              >
                {/* O Círculo de Status */}
                <div className={`w-4 h-4 rounded-full border-2 transition-all flex items-center justify-center
                  ${ponto.concluido 
                    ? 'bg-dourado-farol border-dourado-farol shadow-glow' 
                    : 'border-white/20 group-hover/ponto:border-dourado-farol/50'}`}
                >
                  {ponto.concluido && <span className="text-[10px] text-azul-noturno">✓</span>}
                </div>

                {/* O Texto com efeito de riscado se concluído */}
                <span className={`transition-all ${ponto.concluido ? 'text-white/30 line-through' : 'text-white/70'}`}>
                  {ponto.texto}
                </span>
              </div>
            ))}
          </div>

          {/* INPUT PARA NOVO PONTO DE LUZ */}
          <div className="flex gap-2 pt-4 border-t border-white/5">
            <input
              type="text"
              placeholder="Adicionar Ponto de Luz..."
              value={novoPonto[porto.id] || ''}
              onChange={(e) => setNovoPonto({ ...novoPonto, [porto.id]: e.target.value })}
              onKeyPress={(e) => e.key === 'Enter' && handleAddPonto(porto.id)}
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-dourado-farol/50 transition-all"
            />
            <button 
              onClick={() => handleAddPonto(porto.id)}
              className="text-dourado-farol hover:text-white text-xs font-bold transition-colors"
            >
              ACENDER
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaMetas;