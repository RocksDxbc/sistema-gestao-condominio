// backend/src/routes/notificacao.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/notificacoes:
 *   get:
 *     tags: [Notificações]
 *     summary: Listar notificações do usuário logado
 *     parameters:
 *       - in: query
 *         name: lida
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Lista de notificações
 */
router.get('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { lida } = req.query;

    const notificacoes = await prisma.notificacao.findMany({
      where: {
        usuarioId: req.user!.id,
        ...(lida !== undefined && { lida: lida === 'true' })
      },
      include: {
        encomenda: {
          select: {
            id: true,
            tipo: true,
            status: true
          }
        }
      },
      orderBy: {
        criadoEm: 'desc'
      },
      take: 50
    });

    res.json(notificacoes);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações' });
  }
});

/**
 * @swagger
 * /api/notificacoes/{id}/marcar-lida:
 *   patch:
 *     tags: [Notificações]
 *     summary: Marcar notificação como lida
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notificação marcada como lida
 */
router.patch('/:id/marcar-lida', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const notificacao = await prisma.notificacao.updateMany({
      where: {
        id,
        usuarioId: req.user!.id
      },
      data: {
        lida: true
      }
    });

    if (notificacao.count === 0) {
      return res.status(404).json({ error: 'Notificação não encontrada' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao marcar notificação:', error);
    res.status(500).json({ error: 'Erro ao marcar notificação' });
  }
});

/**
 * @swagger
 * /api/notificacoes/marcar-todas-lidas:
 *   patch:
 *     tags: [Notificações]
 *     summary: Marcar todas as notificações como lidas
 *     responses:
 *       200:
 *         description: Notificações marcadas como lidas
 */
router.patch('/marcar-todas-lidas', authMiddleware, async (req: AuthRequest, res) => {
  try {
    await prisma.notificacao.updateMany({
      where: {
        usuarioId: req.user!.id,
        lida: false
      },
      data: {
        lida: true
      }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao marcar notificações:', error);
    res.status(500).json({ error: 'Erro ao marcar notificações' });
  }
});

/**
 * @swagger
 * /api/notificacoes/nao-lidas/count:
 *   get:
 *     tags: [Notificações]
 *     summary: Contar notificações não lidas
 *     responses:
 *       200:
 *         description: Quantidade de notificações não lidas
 */
router.get('/nao-lidas/count', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const count = await prisma.notificacao.count({
      where: {
        usuarioId: req.user!.id,
        lida: false
      }
    });

    res.json({ count });
  } catch (error) {
    console.error('Erro ao contar notificações:', error);
    res.status(500).json({ error: 'Erro ao contar notificações' });
  }
});

export default router;