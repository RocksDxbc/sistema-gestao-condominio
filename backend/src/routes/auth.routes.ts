// backend/src/routes/auth.routes.ts

import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Autenticação]
 *     summary: Realiza login no sistema
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               senha:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *       401:
 *         description: Credenciais inválidas
 */
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await prisma.usuario.findUnique({
      where: { email },
      include: {
        morador: true,
        funcionario: true
      }
    });

    if (!usuario || !usuario.ativo) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, role: usuario.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    const { senha: _, ...usuarioSemSenha } = usuario;

    res.json({
      token,
      usuario: usuarioSemSenha
    });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
});

/**
 * @swagger
 * /api/auth/cadastro-morador:
 *   post:
 *     tags: [Autenticação]
 *     summary: Cadastro de novo morador
 *     security: []
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
 *             properties:
 *               email:
 *                 type: string
 *               senha:
 *                 type: string
 *               nome:
 *                 type: string
 *               cpf:
 *                 type: string
 *               telefone:
 *                 type: string
 *               torre:
 *                 type: string
 *                 enum: [A, B]
 *               andar:
 *                 type: integer
 *               apartamento:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Morador cadastrado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/cadastro-morador', async (req, res) => {
  try {
    const { email, senha, nome, cpf, telefone, torre, andar, apartamento } = req.body;

    // Validações
    if (andar < 1 || andar > 23) {
      return res.status(400).json({ error: 'Andar deve estar entre 1 e 23' });
    }

    if (apartamento < 1 || apartamento > 8) {
      return res.status(400).json({ error: 'Apartamento deve estar entre 1 e 8' });
    }

    if (!['A', 'B'].includes(torre)) {
      return res.status(400).json({ error: 'Torre deve ser A ou B' });
    }

    // Verificar se já existe morador neste apartamento
    const apartamentoExistente = await prisma.morador.findUnique({
      where: {
        torre_andar_apartamento: {
          torre,
          andar: parseInt(andar),
          apartamento: parseInt(apartamento)
        }
      }
    });

    if (apartamentoExistente) {
      return res.status(400).json({ error: 'Apartamento já possui morador cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
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

    const { senha: _, ...usuarioSemSenha } = usuario;

    res.status(201).json(usuarioSemSenha);
  } catch (error: any) {
    console.error('Erro no cadastro:', error);
    
    if (error.code === 'P2002') {
      return res.status(400).json({ error: 'Email ou CPF já cadastrado' });
    }
    
    res.status(500).json({ error: 'Erro ao cadastrar morador' });
  }
});

export default router;