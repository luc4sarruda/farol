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
              <div key={ponto.id} className="flex items-center gap-3 text-sm text-white/70 bg-white/5 p-2 rounded-lg border border-white/5">
                <div className={`w-2 h-2 rounded-full ${ponto.concluido ? 'bg-dourado-farol shadow-glow' : 'bg-white/20'}`} />
                {ponto.texto}
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