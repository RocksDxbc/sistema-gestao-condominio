// backend/src/swagger.ts

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Sistema de Gestão de Condomínio',
      version: '1.0.0',
      description: 'API completa para gerenciamento de condomínio residencial com 2 torres',
      contact: {
        name: 'Suporte Técnico',
        email: 'suporte@condominio.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Servidor de Desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtido no endpoint /api/auth/login'
        }
      },
      schemas: {
        Usuario: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            nome: { type: 'string' },
            cpf: { type: 'string' },
            telefone: { type: 'string' },
            role: { type: 'string', enum: ['MORADOR', 'ADMIN', 'PORTEIRO', 'RECEPCIONISTA', 'RONDA_DIURNO', 'RONDA_NOTURNO', 'ZELADOR'] },
            ativo: { type: 'boolean' }
          }
        },
        Morador: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            torre: { type: 'string', enum: ['A', 'B'] },
            andar: { type: 'integer', minimum: 1, maximum: 23 },
            apartamento: { type: 'integer', minimum: 1, maximum: 8 },
            usuario: { $ref: '#/components/schemas/Usuario' }
          }
        },
        Encomenda: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            tipo: { type: 'string', enum: ['CARTA', 'CAIXA_PEQUENA', 'CAIXA_MEDIA', 'CAIXA_GRANDE', 'ENVELOPE', 'OUTROS'] },
            descricao: { type: 'string' },
            imagemUrl: { type: 'string' },
            status: { type: 'string', enum: ['PENDENTE', 'RETIRADA', 'DEVOLVIDA'] },
            dataChegada: { type: 'string', format: 'date-time' },
            dataRetirada: { type: 'string', format: 'date-time' },
            observacoes: { type: 'string' }
          }
        },
        Notificacao: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            titulo: { type: 'string' },
            mensagem: { type: 'string' },
            lida: { type: 'boolean' },
            tipo: { type: 'string' },
            criadoEm: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' }
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      { name: 'Autenticação', description: 'Endpoints de login e cadastro' },
      { name: 'Moradores', description: 'Gerenciamento de moradores' },
      { name: 'Funcionários', description: 'Gerenciamento de funcionários' },
      { name: 'Encomendas', description: 'Registro e consulta de encomendas' },
      { name: 'Notificações', description: 'Sistema de notificações' }
    ]
  },
  apis: ['./src/routes/*.ts']
};

export const specs = swaggerJsdoc(options);