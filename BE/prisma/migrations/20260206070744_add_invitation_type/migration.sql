/*
  Warnings:

  - You are about to drop the column `accepted` on the `Invitations` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Invitations` table. All the data in the column will be lost.
  - Added the required column `expires_at` to the `Invitations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_id` to the `Invitations` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvitationTypeEnum" AS ENUM ('email', 'link');

-- DropIndex
DROP INDEX "Invitations_board_id_key";

-- DropIndex
DROP INDEX "Invitations_project_id_key";

-- AlterTable
ALTER TABLE "Invitations" DROP COLUMN "accepted",
DROP COLUMN "expiresAt",
ADD COLUMN     "accepted_at" TIMESTAMP(3),
ADD COLUMN     "expires_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "role_id" TEXT NOT NULL,
ADD COLUMN     "status" "InvitationStatusEnum" NOT NULL DEFAULT 'pending',
ADD COLUMN     "type" "InvitationTypeEnum" NOT NULL DEFAULT 'email';

-- CreateIndex
CREATE INDEX "Invitations_email_status_idx" ON "Invitations"("email", "status");
