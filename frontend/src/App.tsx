import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import CadastroMorador from './pages/CadastroMorador';
import DashboardMorador from './pages/DashboardMorador';
import DashboardAdmin from './pages/DashboardAdmin';

const PrivateRoute = ({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) => {
  const { usuario, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { usuario } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<CadastroMorador />} />
      
      <Route
        path="/morador/*"
        element={
          <PrivateRoute allowedRoles={['MORADOR']}>
            <DashboardMorador />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/admin/*"
        element={
          <PrivateRoute allowedRoles={['ADMIN', 'PORTEIRO', 'RECEPCIONISTA', 'RONDA_DIURNO', 'RONDA_NOTURNO', 'ZELADOR']}>
            <DashboardAdmin />
          </PrivateRoute>
        }
      />
      
      <Route
        path="/"
        element={
          usuario ? (
            usuario.role === 'MORADOR' ? (
              <Navigate to="/morador" />
            ) : (
              <Navigate to="/admin" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;