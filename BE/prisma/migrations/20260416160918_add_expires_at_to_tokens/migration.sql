/*
  Warnings:

  - Added the required column `expires_at` to the `Tokens` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tokens" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL;
