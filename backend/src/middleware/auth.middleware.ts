// backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
  }
  next();
};

export const isAdminOrStaff = (req: AuthRequest, res: Response, next: NextFunction) => {
  const staffRoles = ['ADMIN', 'PORTEIRO', 'RECEPCIONISTA', 'RONDA_DIURNO', 'RONDA_NOTURNO', 'ZELADOR'];
  
  if (!req.user || !staffRoles.includes(req.user.role)) {
    return res.status(403).json({ error: 'Acesso negado. Apenas funcionários.' });
  }
  next();
};