import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Função para verificar se já existe uma sessão ativa no backend
    const checkLoggedIn = async () => {
      try {
        // Vamos criar essa rota no backend daqui a pouco
        const response = await axios.get('http://127.0.0.1:5000/check_session');
        setUser(response.data);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post('http://127.0.0.1:5000/login', { email, password });
    setUser(response.data.user); // Assumindo que o login retornará os dados do usuário
    return response;
  };

  const logout = async () => {
    await axios.post('http://127.0.0.1:5000/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};