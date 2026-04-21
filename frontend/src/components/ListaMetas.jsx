import React, { useState, useEffect, useContext } from 'react'; // 1. Importar useContext
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 2. Importar nosso AuthContext


function ListaMetas({ metas }) {
  return (
    <div className="grid gap-6">
      {metas.map((porto) => (
        <div 
          key={porto.id} 
          className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:border-dourado-farol/30 transition-all group"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-dourado-farol text-sm font-bold tracking-widest uppercase">
                  Porto Seguro
                </span>
                {porto.concluido && (
                  <span className="bg-green-500/20 text-green-400 text-[10px] px-2 py-0.5 rounded-full border border-green-500/30">
                    ALCANÇADO
                  </span>
                )}
              </div>
              {/* O 'texto' que vem do backend agora é tratado como Título */}
              <h3 className="text-xl font-bold text-white group-hover:text-dourado-farol transition-colors">
                {porto.texto}
              </h3>
            </div>
            
            {/* Botão de Checkbox Estilizado */}
            <button className="w-8 h-8 rounded-full border-2 border-white/10 flex items-center justify-center hover:border-dourado-farol transition-all">
               {porto.concluido ? '⚓' : ''}
            </button>
          </div>

          {/* Exibição da Descrição (A nova alma do Porto Seguro) */}
          {porto.descricao && (
            <p className="text-cinza-suave text-sm leading-relaxed mb-4">
              {porto.descricao}
            </p>
          )}

          {/* Área que receberá os Pontos de Luz no futuro */}
          <div className="mt-6 pt-6 border-t border-white/5">
            <div className="flex justify-between items-center text-xs text-white/40">
              <span>0 Pontos de Luz acesos</span>
              <button className="text-dourado-farol/60 hover:text-dourado-farol font-medium transition-colors">
                + Adicionar Ponto de Luz
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaMetas;