// backend/src/routes/funcionario.routes.ts

import { Router as RouterFunc } from 'express';
import { PrismaClient as PrismaFunc } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authMiddleware, isAdmin } from '../middleware/auth.middleware';

const routerFunc = RouterFunc();
const prismaFunc = new PrismaFunc();

/**
 * @swagger
 * /api/funcionarios:
 *   get:
 *     tags: [Funcionários]
 *     summary: Listar todos os funcionários
 *     responses:
 *       200:
 *         description: Lista de funcionários
 */
routerFunc.get('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const funcionarios = await prismaFunc.funcionario.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            telefone: true,
            role: true,
            ativo: true
          }
        }
      },
      orderBy: {
        dataAdmissao: 'desc'
      }
    });

    res.json(funcionarios);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar funcionários' });
  }
});

/**
 * @swagger
 * /api/funcionarios:
 *   post:
 *     tags: [Funcionários]
 *     summary: Cadastrar novo funcionário (admin)
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
 *               - cargo
 *             properties:
 *               cargo:
 *                 type: string
 *                 enum: [PORTEIRO, RECEPCIONISTA, RONDA_DIURNO, RONDA_NOTURNO, ZELADOR]
 *     responses:
 *       201:
 *         description: Funcionário cadastrado
 */
routerFunc.post('/', authMiddleware, isAdmin, async (req, res) => {
  try {
    const { email, senha, nome, cpf, telefone, cargo } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);

    const funcionario = await prismaFunc.usuario.create({
      data: {
        email,
        senha: senhaHash,
        nome,
        cpf,
        telefone,
        role: cargo,
        funcionario: {
          create: {
            cargo
          }
        }
      },
      include: {
        funcionario: true
      }
    });

    const { senha: _, ...funcionarioSemSenha } = funcionario;
    res.status(201).json(funcionarioSemSenha);
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
    }
    res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
  }
});

export default routerFunc;