import React, { useState } from 'react';
import axios from 'axios';

function FormularioPorto({ onPortoAdicionado }) {
  // 'useState' para guardar o texto que o usuário digita no campo
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: ''
  });

  // Esta função será chamada quando o formulário for enviado
  const handleSubmit = async (event) => {
    // Impede o comportamento padrão do formulário, que é recarregar a página
    event.preventDefault();

    // Se o campo de texto estiver vazio, não faz nada
    if (!formData.titulo.trim()) return;

    try {
      // Enviamos o objeto completo para a nova rota do backend
      await axios.post('http://127.0.0.1:5000/metas', {
        texto: formData.titulo,
        descricao: formData.descricao
      });
      
      setFormData({ titulo: '', descricao: '' }); // Limpa os campos
      onPortoAdicionado(); // Atualiza a lista na HomePage
    } catch (error) {
      console.error("Erro ao iluminar porto seguro:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="flex flex-col gap-4">
        {/* Input de Título - Foco na Clareza */}
        <input
          type="text"
          placeholder="Qual o seu próximo Porto Seguro?"
          value={formData.titulo}
          onChange={(e) => setFormData({...formData, titulo: e.target.value})}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-cinza-suave focus:outline-none focus:border-dourado-farol/50 focus:ring-1 focus:ring-dourado-farol/50 transition-all text-lg font-medium"
        />

        {/* Textarea de Descrição - Onde a visão se expande */}
        <textarea
          placeholder="Descreva a visão desse destino... Por que ele é importante?"
          value={formData.descricao}
          onChange={(e) => setFormData({...formData, descricao: e.target.value})}
          rows="2"
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-cinza-suave focus:outline-none focus:border-dourado-farol/50 transition-all resize-none text-sm"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-dourado-farol text-azul-noturno px-8 py-3 rounded-xl font-bold hover:shadow-glow hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          <span className="text-xl">+</span> Iluminar Porto
        </button>
      </div>
    </form>
  );
}

export default FormularioPorto;