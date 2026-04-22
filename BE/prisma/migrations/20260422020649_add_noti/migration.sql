-- CreateEnum
CREATE TYPE "NotificationTypeEnum" AS ENUM ('BOARD_INVITED', 'PROJECT_INVITED', 'CARD_ASSIGNED', 'CARD_COMMENTED', 'CARD_DUE_SOON');

-- CreateEnum
CREATE TYPE "NotificationEntityTypeEnum" AS ENUM ('PROJECT', 'BOARD', 'CARD', 'INVITATION');

-- CreateTable
CREATE TABLE "Notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "actor_id" TEXT,
    "type" "NotificationTypeEnum" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "entity_type" "NotificationEntityTypeEnum",
    "entity_id" TEXT,
    "metadata" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Notifications_user_id_is_read_created_at_idx" ON "Notifications"("user_id", "is_read", "created_at");

-- CreateIndex
CREATE INDEX "Notifications_user_id_created_at_idx" ON "Notifications"("user_id", "created_at");

-- AddForeignKey
ALTER TABLE "Notifications" ADD CONSTRAINT "Notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
