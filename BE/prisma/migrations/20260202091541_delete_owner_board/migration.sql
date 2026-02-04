/*
  Warnings:

  - You are about to drop the column `owner_id` on the `Boards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Boards" DROP CONSTRAINT "Boards_owner_id_fkey";

-- AlterTable
ALTER TABLE "Boards" DROP COLUMN "owner_id";
