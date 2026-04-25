-- CreateEnum
CREATE TYPE "ListStatusEnum" AS ENUM ('active', 'archived');

-- CreateEnum
CREATE TYPE "CardStatusEnum" AS ENUM ('active', 'archived');

-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "background" TEXT,
ADD COLUMN     "is_complete" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "status" "CardStatusEnum" NOT NULL DEFAULT 'active';

-- AlterTable
ALTER TABLE "Lists" ADD COLUMN     "status" "ListStatusEnum" NOT NULL DEFAULT 'active';

-- CreateTable
CREATE TABLE "Email_Verifications" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" CHAR(6) NOT NULL,
    "token" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Email_Verifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Email_Verifications_token_key" ON "Email_Verifications"("token");

-- CreateIndex
CREATE INDEX "Email_Verifications_email_idx" ON "Email_Verifications"("email");
