import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useContext(AuthContext);

  // Enquanto a sessão está sendo verificada, não mostre nada
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se não há usuário logado, redireciona para a página de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Se há um usuário logado, mostra a página que está protegida
  return children;
}

export default ProtectedRoute;