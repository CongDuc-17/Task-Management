/*
  Warnings:

  - A unique constraint covering the columns `[google_id]` on the table `Social_Accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Boards" ADD COLUMN     "background" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Social_Accounts_google_id_key" ON "Social_Accounts"("google_id");
