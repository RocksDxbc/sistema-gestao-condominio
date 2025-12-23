-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('MORADOR', 'ADMIN', 'PORTEIRO', 'RECEPCIONISTA', 'RONDA_DIURNO', 'RONDA_NOTURNO', 'ZELADOR');

-- CreateEnum
CREATE TYPE "TipoEncomenda" AS ENUM ('CARTA', 'CAIXA_PEQUENA', 'CAIXA_MEDIA', 'CAIXA_GRANDE', 'ENVELOPE', 'OUTROS');

-- CreateEnum
CREATE TYPE "StatusEncomenda" AS ENUM ('PENDENTE', 'RETIRADA', 'DEVOLVIDA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MORADOR',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "moradores" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "torre" TEXT NOT NULL,
    "andar" INTEGER NOT NULL,
    "apartamento" INTEGER NOT NULL,
    "dataIngresso" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "moradores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "funcionarios" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "cargo" "UserRole" NOT NULL,
    "dataAdmissao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "funcionarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "encomendas" (
    "id" TEXT NOT NULL,
    "moradorId" TEXT NOT NULL,
    "registradoPorId" TEXT NOT NULL,
    "tipo" "TipoEncomenda" NOT NULL,
    "descricao" TEXT,
    "imagemUrl" TEXT,
    "status" "StatusEncomenda" NOT NULL DEFAULT 'PENDENTE',
    "dataChegada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataRetirada" TIMESTAMP(3),
    "observacoes" TEXT,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "encomendas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "encomendaId" TEXT,
    "titulo" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "lida" BOOLEAN NOT NULL DEFAULT false,
    "tipo" TEXT NOT NULL DEFAULT 'ENCOMENDA',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "moradores_usuarioId_key" ON "moradores"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "moradores_torre_andar_apartamento_key" ON "moradores"("torre", "andar", "apartamento");

-- CreateIndex
CREATE UNIQUE INDEX "funcionarios_usuarioId_key" ON "funcionarios"("usuarioId");

-- CreateIndex
CREATE INDEX "encomendas_moradorId_status_idx" ON "encomendas"("moradorId", "status");

-- CreateIndex
CREATE INDEX "encomendas_dataChegada_idx" ON "encomendas"("dataChegada");

-- CreateIndex
CREATE INDEX "notificacoes_usuarioId_lida_idx" ON "notificacoes"("usuarioId", "lida");

-- CreateIndex
CREATE INDEX "notificacoes_criadoEm_idx" ON "notificacoes"("criadoEm");

-- AddForeignKey
ALTER TABLE "moradores" ADD CONSTRAINT "moradores_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "funcionarios" ADD CONSTRAINT "funcionarios_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encomendas" ADD CONSTRAINT "encomendas_moradorId_fkey" FOREIGN KEY ("moradorId") REFERENCES "moradores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "encomendas" ADD CONSTRAINT "encomendas_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "funcionarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes" ADD CONSTRAINT "notificacoes_encomendaId_fkey" FOREIGN KEY ("encomendaId") REFERENCES "encomendas"("id") ON DELETE CASCADE ON UPDATE CASCADE;
