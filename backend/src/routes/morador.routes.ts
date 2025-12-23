// backend/src/routes/morador.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authMiddleware, isAdminOrStaff } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/moradores:
 *   get:
 *     tags: [Moradores]
 *     summary: Listar todos os moradores
 *     responses:
 *       200:
 *         description: Lista de moradores
 */
router.get('/', authMiddleware, isAdminOrStaff, async (req, res) => {
  try {
    const moradores = await prisma.morador.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            ativo: true
          }
        }
      },
      orderBy: [
        { torre: 'asc' },
        { andar: 'asc' },
        { apartamento: 'asc' }
      ]
    });

    res.json(moradores);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar moradores' });
  }
});

/**
 * @swagger
 * /api/moradores:
 *   post:
 *     tags: [Moradores]
 *     summary: Cadastrar novo morador (admin)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *               - nome
 *               - cpf
 *               - telefone
 *               - torre
 *               - andar
 *               - apartamento
 *     responses:
 *       201:
 *         description: Morador cadastrado
 */
router.post('/', authMiddleware, isAdminOrStaff, async (req, res) => {
  try {
    const { email, senha, nome, cpf, telefone, torre, andar, apartamento } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const morador = await prisma.usuario.create({
      data: {
        email,
        senha: senhaHash,
        nome,
        cpf,
        telefone,
        role: 'MORADOR',
        morador: {
          create: {
            torre,
            andar: parseInt(andar),
            apartamento: parseInt(apartamento)
          }
        }
      },
      include: {
        morador: true
      }
    });

    const { senha: _, ...moradorSemSenha } = morador;
    res.status(201).json(moradorSemSenha);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email, CPF ou apartamento já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar morador' });
  }
});

export default router;