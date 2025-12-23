// backend/prisma/seed.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Criar usuário admin
  const senhaAdmin = await bcrypt.hash('admin123', 10);
  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@condominio.com' },
    update: {},
    create: {
      email: 'admin@condominio.com',
      senha: senhaAdmin,
      nome: 'Administrador',
      cpf: '000.000.000-00',
      telefone: '(11) 99999-0000',
      role: 'ADMIN',
      funcionario: {
        create: {
          cargo: 'ADMIN'
        }
      }
    }
  });
  console.log('✅ Admin criado:', admin.email);

  // Criar porteiro
  const senhaPorteiro = await bcrypt.hash('porteiro123', 10);
  const porteiro = await prisma.usuario.upsert({
    where: { email: 'porteiro@condominio.com' },
    update: {},
    create: {
      email: 'porteiro@condominio.com',
      senha: senhaPorteiro,
      nome: 'João Porteiro',
      cpf: '111.111.111-11',
      telefone: '(11) 99999-1111',
      role: 'PORTEIRO',
      funcionario: {
        create: {
          cargo: 'PORTEIRO'
        }
      }
    }
  });
  console.log('✅ Porteiro criado:', porteiro.email);

  // Criar moradores de exemplo
  const senhaMorador = await bcrypt.hash('morador123', 10);
  
  const morador1 = await prisma.usuario.upsert({
    where: { email: 'morador1@teste.com' },
    update: {},
    create: {
      email: 'morador1@teste.com',
      senha: senhaMorador,
      nome: 'Maria Silva',
      cpf: '222.222.222-22',
      telefone: '(11) 98888-1111',
      role: 'MORADOR',
      morador: {
        create: {
          torre: 'A',
          andar: 5,
          apartamento: 3
        }
      }
    }
  });
  console.log('✅ Morador 1 criado:', morador1.email, '- Torre A, Andar 5, Apt 3');

  const morador2 = await prisma.usuario.upsert({
    where: { email: 'morador2@teste.com' },
    update: {},
    create: {
      email: 'morador2@teste.com',
      senha: senhaMorador,
      nome: 'José Santos',
      cpf: '333.333.333-33',
      telefone: '(11) 98888-2222',
      role: 'MORADOR',
      morador: {
        create: {
          torre: 'B',
          andar: 10,
          apartamento: 7
        }
      }
    }
  });
  console.log('✅ Morador 2 criado:', morador2.email, '- Torre B, Andar 10, Apt 7');

  const morador3 = await prisma.usuario.upsert({
    where: { email: 'morador3@teste.com' },
    update: {},
    create: {
      email: 'morador3@teste.com',
      senha: senhaMorador,
      nome: 'Ana Costa',
      cpf: '444.444.444-44',
      telefone: '(11) 98888-3333',
      role: 'MORADOR',
      morador: {
        create: {
          torre: 'A',
          andar: 15,
          apartamento: 2
        }
      }
    }
  });
  console.log('✅ Morador 3 criado:', morador3.email, '- Torre A, Andar 15, Apt 2');

  console.log('\n🎉 Seed concluído com sucesso!');
  console.log('\n📋 Credenciais de acesso:');
  console.log('─────────────────────────────────');
  console.log('Admin:');
  console.log('  Email: admin@condominio.com');
  console.log('  Senha: admin123');
  console.log('\nPorteiro:');
  console.log('  Email: porteiro@condominio.com');
  console.log('  Senha: porteiro123');
  console.log('\nMoradores (todos com senha: morador123):');
  console.log('  1. morador1@teste.com - Torre A, 5º andar, Apt 3');
  console.log('  2. morador2@teste.com - Torre B, 10º andar, Apt 7');
  console.log('  3. morador3@teste.com - Torre A, 15º andar, Apt 2');
  console.log('─────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro no seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });