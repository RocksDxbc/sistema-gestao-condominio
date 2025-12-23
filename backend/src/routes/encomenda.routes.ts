// backend/src/routes/encomenda.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import { authMiddleware, isAdminOrStaff, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

// Configurar upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'encomenda-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Apenas imagens são permitidas'));
  }
});

/**
 * @swagger
 * /api/encomendas:
 *   post:
 *     tags: [Encomendas]
 *     summary: Registrar nova encomenda (apenas funcionários)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - moradorId
 *               - tipo
 *             properties:
 *               moradorId:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [CARTA, CAIXA_PEQUENA, CAIXA_MEDIA, CAIXA_GRANDE, ENVELOPE, OUTROS]
 *               descricao:
 *                 type: string
 *               observacoes:
 *                 type: string
 *               imagem:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Encomenda registrada com sucesso
 */
router.post('/', authMiddleware, isAdminOrStaff, upload.single('imagem'), async (req: AuthRequest, res) => {
  try {
    const { moradorId, tipo, descricao, observacoes } = req.body;

    const funcionario = await prisma.funcionario.findUnique({
      where: { usuarioId: req.user!.id }
    });

    if (!funcionario) {
      return res.status(403).json({ error: 'Funcionário não encontrado' });
    }

    const imagemUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const encomenda = await prisma.encomenda.create({
      data: {
        moradorId,
        registradoPorId: funcionario.id,
        tipo,
        descricao,
        observacoes,
        imagemUrl
      },
      include: {
        morador: {
          include: {
            usuario: true
          }
        }
      }
    });

    // Criar notificação para o morador
    await prisma.notificacao.create({
      data: {
        usuarioId: encomenda.morador.usuarioId,
        encomendaId: encomenda.id,
        titulo: 'Nova encomenda recebida!',
        mensagem: `Você tem uma ${tipo.toLowerCase().replace('_', ' ')} aguardando retirada.`,
        tipo: 'ENCOMENDA'
      }
    });

    // Agendar lembretes (simulado - em produção usar cron job)
    scheduleReminders(encomenda.id, encomenda.morador.usuarioId);

    res.status(201).json(encomenda);
  } catch (error) {
    console.error('Erro ao registrar encomenda:', error);
    res.status(500).json({ error: 'Erro ao registrar encomenda' });
  }
});

/**
 * @swagger
 * /api/encomendas/minhas:
 *   get:
 *     tags: [Encomendas]
 *     summary: Listar encomendas do morador logado
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDENTE, RETIRADA, DEVOLVIDA]
 *     responses:
 *       200:
 *         description: Lista de encomendas
 */
router.get('/minhas', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { status } = req.query;

    const morador = await prisma.morador.findUnique({
      where: { usuarioId: req.user!.id }
    });

    if (!morador) {
      return res.status(404).json({ error: 'Morador não encontrado' });
    }

    const encomendas = await prisma.encomenda.findMany({
      where: {
        moradorId: morador.id,
        ...(status && { status: status as any })
      },
      include: {
        registradoPor: {
          include: {
            usuario: {
              select: {
                nome: true,
                role: true
              }
            }
          }
        }
      },
      orderBy: {
        dataChegada: 'desc'
      }
    });

    res.json(encomendas);
  } catch (error) {
    console.error('Erro ao buscar encomendas:', error);
    res.status(500).json({ error: 'Erro ao buscar encomendas' });
  }
});

/**
 * @swagger
 * /api/encomendas/{id}/retirar:
 *   patch:
 *     tags: [Encomendas]
 *     summary: Marcar encomenda como retirada
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Encomenda marcada como retirada
 */
router.patch('/:id/retirar', authMiddleware, isAdminOrStaff, async (req, res) => {
  try {
    const { id } = req.params;

    const encomenda = await prisma.encomenda.update({
      where: { id },
      data: {
        status: 'RETIRADA',
        dataRetirada: new Date()
      }
    });

    res.json(encomenda);
  } catch (error) {
    console.error('Erro ao atualizar encomenda:', error);
    res.status(500).json({ error: 'Erro ao atualizar encomenda' });
  }
});

/**
 * @swagger
 * /api/encomendas:
 *   get:
 *     tags: [Encomendas]
 *     summary: Listar todas as encomendas (apenas funcionários)
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: torre
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de encomendas
 */
router.get('/', authMiddleware, isAdminOrStaff, async (req, res) => {
  try {
    const { status, torre } = req.query;

    const encomendas = await prisma.encomenda.findMany({
      where: {
        ...(status && { status: status as any }),
        ...(torre && {
          morador: {
            torre: torre as string
          }
        })
      },
      include: {
        morador: {
          include: {
            usuario: {
              select: {
                nome: true,
                telefone: true
              }
            }
          }
        }
      },
      orderBy: {
        dataChegada: 'desc'
      },
      take: 100
    });

    res.json(encomendas);
  } catch (error) {
    console.error('Erro ao buscar encomendas:', error);
    res.status(500).json({ error: 'Erro ao buscar encomendas' });
  }
});

// Função auxiliar para agendar lembretes (simplificada)
async function scheduleReminders(encomendaId: string, usuarioId: string) {
  // Em produção, use um sistema de jobs como Bull ou node-cron
  // Aqui é uma simulação
  setTimeout(async () => {
    const encomenda = await prisma.encomenda.findUnique({
      where: { id: encomendaId }
    });

    if (encomenda && encomenda.status === 'PENDENTE') {
      await prisma.notificacao.create({
        data: {
          usuarioId,
          encomendaId,
          titulo: 'Lembrete: Encomenda aguardando',
          mensagem: 'Sua encomenda está aguardando retirada há mais de 12 horas.',
          tipo: 'LEMBRETE'
        }
      });
    }
  }, 12 * 60 * 60 * 1000); // 12 horas
}

export default router;