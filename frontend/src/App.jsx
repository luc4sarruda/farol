import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute'; // IMPORTAR

function App() {
  return (
    <div className="App">
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute> {/* ENVOLVER AQUI */}
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </div>
  );
}

export default App;