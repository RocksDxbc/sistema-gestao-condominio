// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { specs } from './swagger';

// Rotas
import authRoutes from './routes/auth.routes';
import moradorRoutes from './routes/morador.routes';
import funcionarioRoutes from './routes/funcionario.routes';
import encomendaRoutes from './routes/encomenda.routes';
import notificacaoRoutes from './routes/notificacao.routes';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (uploads)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Documentação Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "API Condomínio - Documentação"
}));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/moradores', moradorRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/encomendas', encomendaRoutes);
app.use('/api/notificacoes', notificacaoRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'API Sistema de Gestão de Condomínio',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      moradores: '/api/moradores',
      funcionarios: '/api/funcionarios',
      encomendas: '/api/encomendas',
      notificacoes: '/api/notificacoes'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Tratamento de erros
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Erro:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Rota não encontrada
app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📚 Documentação: http://localhost:${PORT}/api-docs`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

export default app;