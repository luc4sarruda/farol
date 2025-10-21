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
      .then(response => {
        console.log("Meta adicionada com sucesso!", response.data);
        setTexto(''); // Limpa o campo de input após o envio

        // ATENÇÃO: A forma mais simples de ver a nova meta na lista é recarregar a página.
        // Em uma aplicação React mais avançada, faríamos isso de forma mais elegante,
        // mas para o nosso MVP, isso é perfeito e funcional.
        window.location.reload();
      })
      .catch(error => {
        console.error("Houve um erro ao adicionar a meta!", error);
      });
  };

  return (
    <form onSubmit={handleSubmit} style={{ margin: '20px 0' }}>
      <input
        type="text"
        value={texto}
        onChange={e => setTexto(e.target.value)}
        placeholder="Qual a sua próxima meta?"
        style={{ marginRight: '10px' }}
      />
      <button type="submit">Adicionar</button>
    </form>
  );
}

export default FormularioMeta;