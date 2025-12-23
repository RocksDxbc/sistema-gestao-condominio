// frontend/src/pages/DashboardAdmin.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Package, Users, UserPlus, LogOut, Building2, Camera, Search, Filter } from 'lucide-react';

export default function DashboardAdmin() {
  const { usuario, logout } = useAuth();
  const [abaAtiva, setAbaAtiva] = useState<'encomendas' | 'moradores' | 'funcionarios' | 'registrar'>('encomendas');
  const [encomendas, setEncomendas] = useState<any[]>([]);
  const [moradores, setMoradores] = useState<any[]>([]);
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  const [formEncomenda, setFormEncomenda] = useState({
    moradorId: '',
    tipo: 'CAIXA_PEQUENA',
    descricao: '',
    observacoes: ''
  });
  const [imagemEncomenda, setImagemEncomenda] = useState<File | null>(null);
  const [previewImagem, setPreviewImagem] = useState<string>('');
  const [salvandoEncomenda, setSalvandoEncomenda] = useState(false);
  const [sucessoEncomenda, setSucessoEncomenda] = useState(false);

  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [filtroTorre, setFiltroTorre] = useState('TODOS');
  const [busca, setBusca] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setCarregando(true);
    await Promise.all([
      carregarEncomendas(),
      carregarMoradores(),
      usuario?.role === 'ADMIN' && carregarFuncionarios()
    ]);
    setCarregando(false);
  };

  const carregarEncomendas = async () => {
    try {
      const response = await api.get('/encomendas');
      setEncomendas(response.data);
    } catch (error) {
      console.error('Erro ao carregar encomendas:', error);
    }
  };

  const carregarMoradores = async () => {
    try {
      const response = await api.get('/moradores');
      setMoradores(response.data);
    } catch (error) {
      console.error('Erro ao carregar moradores:', error);
    }
  };

  const carregarFuncionarios = async () => {
    try {
      const response = await api.get('/funcionarios');
      setFuncionarios(response.data);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagemEncomenda(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const registrarEncomenda = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvandoEncomenda(true);

    try {
      const formData = new FormData();
      formData.append('moradorId', formEncomenda.moradorId);
      formData.append('tipo', formEncomenda.tipo);
      formData.append('descricao', formEncomenda.descricao);
      formData.append('observacoes', formEncomenda.observacoes);
      
      if (imagemEncomenda) {
        formData.append('imagem', imagemEncomenda);
      }

      await api.post('/encomendas', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setSucessoEncomenda(true);
      setFormEncomenda({ moradorId: '', tipo: 'CAIXA_PEQUENA', descricao: '', observacoes: '' });
      setImagemEncomenda(null);
      setPreviewImagem('');
      
      await carregarEncomendas();
      
      setTimeout(() => {
        setSucessoEncomenda(false);
        setAbaAtiva('encomendas');
      }, 2000);
    } catch (error: any) {
      alert(error.response?.data?.error || 'Erro ao registrar encomenda');
    } finally {
      setSalvandoEncomenda(false);
    }
  };

  const marcarComoRetirada = async (id: string) => {
    if (!window.confirm('Confirmar retirada da encomenda?')) return;
    
    try {
      await api.patch(`/encomendas/${id}/retirar`);
      await carregarEncomendas();
    } catch (error) {
      alert('Erro ao marcar como retirada');
    }
  };

  const encomendasFiltradas = encomendas.filter(e => {
    if (filtroStatus !== 'TODOS' && e.status !== filtroStatus) return false;
    if (filtroTorre !== 'TODOS' && e.morador.torre !== filtroTorre) return false;
    if (busca) {
      const buscaLower = busca.toLowerCase();
      return (
        e.morador.usuario.nome.toLowerCase().includes(buscaLower) ||
        `${e.morador.torre}${e.morador.andar}${e.morador.apartamento}`.includes(busca)
      );
    }
    return true;
  });

  const moradoresFiltrados = moradores.filter(m => {
    if (!busca) return true;
    const buscaLower = busca.toLowerCase();
    return (
      m.usuario.nome.toLowerCase().includes(buscaLower) ||
      `${m.torre}${m.andar}${m.apartamento}`.includes(busca)
    );
  });

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
                <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
                <p className="text-sm text-gray-600">{usuario?.nome} • {usuario?.role}</p>
              </div>
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
      </header>

      {/* Conteúdo */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Total Encomendas</p>
            <p className="text-3xl font-bold text-blue-600">{encomendas.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Pendentes</p>
            <p className="text-3xl font-bold text-yellow-600">
              {encomendas.filter(e => e.status === 'PENDENTE').length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-600 mb-1">Moradores</p>
            <p className="text-3xl font-bold text-green-600">{moradores.length}</p>
          </div>
          {usuario?.role === 'ADMIN' && (
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-sm text-gray-600 mb-1">Funcionários</p>
              <p className="text-3xl font-bold text-purple-600">{funcionarios.length}</p>
            </div>
          )}
        </div>

        {/* Abas */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <div className="flex space-x-4 px-6 overflow-x-auto">
              <button
                onClick={() => setAbaAtiva('registrar')}
                className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  abaAtiva === 'registrar'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Registrar Encomenda
              </button>
              <button
                onClick={() => setAbaAtiva('encomendas')}
                className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  abaAtiva === 'encomendas'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                Encomendas
              </button>
              <button
                onClick={() => setAbaAtiva('moradores')}
                className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                  abaAtiva === 'moradores'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Moradores
              </button>
              {usuario?.role === 'ADMIN' && (
                <button
                  onClick={() => setAbaAtiva('funcionarios')}
                  className={`py-4 px-4 border-b-2 font-medium text-sm whitespace-nowrap transition ${
                    abaAtiva === 'funcionarios'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <UserPlus className="w-5 h-5 inline mr-2" />
                  Funcionários
                </button>
              )}
            </div>
          </div>

          <div className="p-6">
            {/* Aba Registrar Encomenda */}
            {abaAtiva === 'registrar' && (
              <div>
                {sucessoEncomenda ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Encomenda registrada!</h3>
                    <p className="text-gray-600">O morador foi notificado.</p>
                  </div>
                ) : (
                  <form onSubmit={registrarEncomenda} className="max-w-2xl">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Nova Encomenda</h2>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Morador *</label>
                        <select
                          value={formEncomenda.moradorId}
                          onChange={(e) => setFormEncomenda({...formEncomenda, moradorId: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        >
                          <option value="">Selecione o morador</option>
                          {moradores.map((m) => (
                            <option key={m.id} value={m.id}>
                              Torre {m.torre} - Andar {m.andar} - Apt {m.apartamento} - {m.usuario.nome}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo *</label>
                        <select
                          value={formEncomenda.tipo}
                          onChange={(e) => setFormEncomenda({...formEncomenda, tipo: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          required
                        >
                          <option value="CARTA">Carta</option>
                          <option value="ENVELOPE">Envelope</option>
                          <option value="CAIXA_PEQUENA">Caixa Pequena</option>
                          <option value="CAIXA_MEDIA">Caixa Média</option>
                          <option value="CAIXA_GRANDE">Caixa Grande</option>
                          <option value="OUTROS">Outros</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
                        <input
                          type="text"
                          value={formEncomenda.descricao}
                          onChange={(e) => setFormEncomenda({...formEncomenda, descricao: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="Ex: Caixa com logo da Amazon"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
                        <textarea
                          value={formEncomenda.observacoes}
                          onChange={(e) => setFormEncomenda({...formEncomenda, observacoes: e.target.value})}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          rows={3}
                          placeholder="Informações adicionais..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto da Encomenda</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                          {previewImagem ? (
                            <div>
                              <img src={previewImagem} alt="Preview" className="max-h-48 mx-auto mb-4 rounded" />
                              <button
                                type="button"
                                onClick={() => {
                                  setImagemEncomenda(null);
                                  setPreviewImagem('');
                                }}
                                className="text-sm text-red-600 hover:text-red-700"
                              >
                                Remover foto
                              </button>
                            </div>
                          ) : (
                            <label className="cursor-pointer">
                              <Camera className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                              <span className="text-sm text-gray-600">Clique para adicionar foto</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleImagemChange}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={salvandoEncomenda}
                      className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition disabled:opacity-50"
                    >
                      {salvandoEncomenda ? 'Registrando...' : 'Registrar Encomenda'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Aba Encomendas */}
            {abaAtiva === 'encomendas' && (
              <div>
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        placeholder="Buscar por nome ou apartamento..."
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="TODOS">Todos os status</option>
                    <option value="PENDENTE">Pendentes</option>
                    <option value="RETIRADA">Retiradas</option>
                  </select>
                  <select
                    value={filtroTorre}
                    onChange={(e) => setFiltroTorre(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="TODOS">Todas as torres</option>
                    <option value="A">Torre A</option>
                    <option value="B">Torre B</option>
                  </select>
                </div>

                <div className="space-y-4">
                  {encomendasFiltradas.map((enc) => (
                    <div key={enc.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              enc.status === 'PENDENTE'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {enc.status === 'PENDENTE' ? 'Pendente' : 'Retirada'}
                            </span>
                            <span className="text-sm font-semibold text-gray-700">
                              Torre {enc.morador.torre} - {enc.morador.andar}º - Apt {enc.morador.apartamento}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-gray-800">{enc.morador.usuario.nome}</p>
                          <p className="text-sm text-gray-600">{enc.tipo.replace('_', ' ')} • {enc.descricao || 'Sem descrição'}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(enc.dataChegada).toLocaleString('pt-BR')}
                          </p>
                          {enc.status === 'PENDENTE' && (
                            <button
                              onClick={() => marcarComoRetirada(enc.id)}
                              className="mt-3 text-sm bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-lg transition"
                            >
                              Marcar como retirada
                            </button>
                          )}
                        </div>
                        {enc.imagemUrl && (
                          <img
                            src={`http://localhost:3001${enc.imagemUrl}`}
                            alt="Encomenda"
                            className="w-24 h-24 object-cover rounded-lg ml-4"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                  {encomendasFiltradas.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Nenhuma encomenda encontrada</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Aba Moradores */}
            {abaAtiva === 'moradores' && (
              <div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      placeholder="Buscar morador..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {moradoresFiltrados.map((m) => (
                    <div key={m.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="font-semibold text-gray-800 mb-1">{m.usuario.nome}</div>
                      <div className="text-sm text-gray-600">
                        Torre {m.torre} • {m.andar}º andar • Apt {m.apartamento}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">{m.usuario.email}</div>
                      <div className="text-xs text-gray-500">{m.usuario.telefone}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Aba Funcionários */}
            {abaAtiva === 'funcionarios' && usuario?.role === 'ADMIN' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {funcionarios.map((f) => (
                  <div key={f.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="font-semibold text-gray-800 mb-1">{f.usuario.nome}</div>
                    <div className="text-sm text-gray-600">{f.cargo.replace('_', ' ')}</div>
                    <div className="text-xs text-gray-500 mt-2">{f.usuario.email}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}