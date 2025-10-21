import React, { useState, useEffect, useContext } from 'react'; // 1. Importar useContext
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // 2. Importar nosso AuthContext

function ListaMetas() {
  const [metas, setMetas] = useState([]);
  const { user } = useContext(AuthContext); // 3. Pegar o usuário do contexto

  // O useEffect agora "observa" a variável 'user'
  useEffect(() => {
    console.log(">>> useEffect do ListaMetas foi acionado.");

    // 4. SÓ TENTA BUSCAR OS DADOS SE HOUVER UM USUÁRIO
    if (user) {
      console.log(">>> Usuário detectado, buscando metas...");
      axios.get('http://127.0.0.1:5000/metas')
        .then(response => {
          console.log(">>> Metas recebidas:", response.data);
          setMetas(response.data);
        })
        .catch(error => {
          console.error(">>> ERRO ao buscar as metas:", error);
          // Limpa as metas se houver um erro de autorização
          setMetas([]);
        });
    } else {
      // Se não há usuário, garante que a lista de metas esteja vazia.
      console.log(">>> Nenhum usuário detectado, limpando metas.");
      setMetas([]);
    }
  }, [user]); // 5. O [user] diz ao React: "Rode este efeito sempre que o 'user' mudar"

  return (
    <div>
      <h2>Minhas Metas</h2>
      {/* Se não houver metas, mostra uma mensagem amigável */}
      {metas.length === 0 ? (
        <p>Nenhuma meta adicionada ainda.</p>
      ) : (
        <ul>
          {metas.map(meta => (
            <li key={meta.id}>{meta.texto}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListaMetas;