// frontend/src/pages/DashboardMorador.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Package, Bell, LogOut, Building2, User, BellOff } from 'lucide-react';

export default function DashboardMorador() {
  const { usuario, logout } = useAuth();
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [notificacoes, setNotificacoes] = useState<any[]>([]);
  const [countNaoLidas, setCountNaoLidas] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'encomendas' | 'notificacoes'>('encomendas');

  useEffect(() => {
    carregarDados();
    const interval = setInterval(carregarNotificacoes, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    await Promise.all([carregarEncomendas(), carregarNotificacoes()]);
    setCarregando(false);
  };

  const carregarEncomendas = async () => {
    try {
      const response = await api.get('/encomendas/minhas');
      setEncomendas(response.data);
    } catch (error) {
      console.error('Erro ao carregar encomendas:', error);
    }
  };

  const carregarNotificacoes = async () => {
    try {
      const [notifResponse, countResponse] = await Promise.all([
        api.get('/notificacoes'),
        api.get('/notificacoes/nao-lidas/count')
      ]);
      setNotificacoes(notifResponse.data);
      setCountNaoLidas(countResponse.data.count);
    } catch (error) {
      console.error('Erro ao carregar notificações:', error);
    }
  };

  const marcarComoLida = async (id: string) => {
    try {
      await api.patch(`/notificacoes/${id}/marcar-lida`);
      carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar notificação:', error);
    }
  };

  const marcarTodasLidas = async () => {
    try {
      await api.patch('/notificacoes/marcar-todas-lidas');
      carregarNotificacoes();
    } catch (error) {
      console.error('Erro ao marcar todas:', error);
    }
  };

  const encomendasPendentes = encomendas.filter(e => e.status === 'PENDENTE');
  const encomendasRetiradas = encomendas.filter(e => e.status === 'RETIRADA');

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Portal do Morador</h1>
                <p className="text-sm text-gray-600">
                  Torre {usuario?.morador?.torre} • Andar {usuario?.morador?.andar} • Apt {usuario?.morador?.apartamento}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">{usuario?.nome}</span>
              </div>
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm font-medium">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Encomendas Pendentes</p>
                <p className="text-3xl font-bold text-blue-600">{encomendasPendentes.length}</p>
              </div>
              <Package className="w-12 h-12 text-blue-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Já Retiradas</p>
                <p className="text-3xl font-bold text-green-600">{encomendasRetiradas.length}</p>
              </div>
              <Package className="w-12 h-12 text-green-600 opacity-20" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notificações Novas</p>
                <p className="text-3xl font-bold text-orange-600">{countNaoLidas}</p>
              </div>
              <Bell className="w-12 h-12 text-orange-600 opacity-20" />
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8 px-6">
              <button
                onClick={() => setAbaAtiva('encomendas')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition ${
                  abaAtiva === 'encomendas'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Minhas Encomendas
              </button>
              <button
                onClick={() => setAbaAtiva('notificacoes')}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition relative ${
                  abaAtiva === 'notificacoes'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Bell className="w-5 h-5 inline mr-2" />
                Notificações
                {countNaoLidas > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {countNaoLidas}
                  </span>
                )}
              </button>
            </div>
          </div>

          <div className="p-6">
            {abaAtiva === 'encomendas' ? (
              <div className="space-y-4">
                {encomendas.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Nenhuma encomenda registrada</p>
                  </div>
                ) : (
                  encomendas.map((encomenda) => (
                    <div key={encomenda.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              encomenda.status === 'PENDENTE'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {encomenda.status === 'PENDENTE' ? 'Aguardando Retirada' : 'Retirada'}
                            </span>
                            <span className="text-sm text-gray-600">
                              {encomenda.tipo.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700">{encomenda.descricao || 'Sem descrição'}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            Chegou em: {new Date(encomenda.dataChegada).toLocaleString('pt-BR')}
                          </p>
                          {encomenda.dataRetirada && (
                            <p className="text-xs text-gray-500">
                              Retirada em: {new Date(encomenda.dataRetirada).toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                        {encomenda.imagemUrl && (
                          <img
                            src={`http://localhost:3001${encomenda.imagemUrl}`}
                            alt="Encomenda"
                            className="w-24 h-24 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {notificacoes.length > 0 && countNaoLidas > 0 && (
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={marcarTodasLidas}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
                    >
                      <BellOff className="w-4 h-4" />
                      <span>Marcar todas como lidas</span>
                    </button>
                  </div>
                )}
                {notificacoes.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Bell className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Nenhuma notificação</p>
                  </div>
                ) : (
                  notificacoes.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => !notif.lida && marcarComoLida(notif.id)}
                      className={`border rounded-lg p-4 cursor-pointer transition ${
                        notif.lida
                          ? 'border-gray-200 bg-white'
                          : 'border-blue-200 bg-blue-50 hover:bg-blue-100'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{notif.titulo}</h3>
                            {!notif.lida && (
                              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{notif.mensagem}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(notif.criadoEm).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}