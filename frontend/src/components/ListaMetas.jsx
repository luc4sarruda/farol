import React, { useState, useEffect, useContext } from 'react'; // 1. Importar useContext
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 2. Importar nosso AuthContext

function ListaMetas({ metas }) {

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white/80 flex items-center gap-3">
        <span className="w-8 h-1 bg-dourado-farol rounded-full block"></span>
        Seus Pontos de Luz
      </h2>

      {metas.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
          <p className="text-cinza-suave">O horizonte está limpo. Que tal iluminar um novo passo?</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {metas.map((meta) => (
            <div 
              key={meta.id} 
              className="group bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-dourado-farol/30 hover:shadow-glow transition-all duration-500 cursor-default"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg text-white/90 group-hover:text-white transition-colors">
                  {meta.texto}
                </p>
                <div className="w-2 h-2 rounded-full bg-dourado-farol shadow-[0_0_8px_rgba(250,204,21,0.8)] opacity-50 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaMetas;