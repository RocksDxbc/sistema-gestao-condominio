import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface Usuario {
  id: string;
  email: string;
  nome: string;
  role: string;
  morador?: any;
  funcionario?: any;
}

interface AuthContextData {
  usuario: Usuario | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => void;
  cadastrarMorador: (dados: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('@condominio:token');
    const usuarioSalvo = localStorage.getItem('@condominio:usuario');

    if (token && usuarioSalvo) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUsuario(JSON.parse(usuarioSalvo));
    }

    setLoading(false);
  }, []);

  const login = async (email: string, senha: string) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      const { token, usuario: usuarioData } = response.data;

      localStorage.setItem('@condominio:token', token);
      localStorage.setItem('@condominio:usuario', JSON.stringify(usuarioData));
      
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUsuario(usuarioData);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    localStorage.removeItem('@condominio:token');
    localStorage.removeItem('@condominio:usuario');
    delete api.defaults.headers.common['Authorization'];
    setUsuario(null);
  };

  const cadastrarMorador = async (dados: any) => {
    try {
      await api.post('/auth/cadastro-morador', dados);
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Erro ao cadastrar');
    }
  };

  return (
    <AuthContext.Provider value={{ usuario, loading, login, logout, cadastrarMorador }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};