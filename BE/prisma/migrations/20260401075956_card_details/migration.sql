-- CreateTable
CREATE TABLE "Labels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "board_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card_Labels" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "label_id" TEXT NOT NULL,

    CONSTRAINT "Card_Labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklists" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checklists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checklist_Items" (
    "id" TEXT NOT NULL,
    "checklist_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Checklist_Items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card_Comments" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_Comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card_Attachments" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_Attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card_Activity" (
    "id" TEXT NOT NULL,
    "card_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Card_Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Labels_board_id_name_key" ON "Labels"("board_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Card_Labels_card_id_label_id_key" ON "Card_Labels"("card_id", "label_id");

-- AddForeignKey
ALTER TABLE "Labels" ADD CONSTRAINT "Labels_board_id_fkey" FOREIGN KEY ("board_id") REFERENCES "Boards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Labels" ADD CONSTRAINT "Card_Labels_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Labels" ADD CONSTRAINT "Card_Labels_label_id_fkey" FOREIGN KEY ("label_id") REFERENCES "Labels"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklists" ADD CONSTRAINT "Checklists_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checklist_Items" ADD CONSTRAINT "Checklist_Items_checklist_id_fkey" FOREIGN KEY ("checklist_id") REFERENCES "Checklists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Comments" ADD CONSTRAINT "Card_Comments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Comments" ADD CONSTRAINT "Card_Comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Attachments" ADD CONSTRAINT "Card_Attachments_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Attachments" ADD CONSTRAINT "Card_Attachments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Activity" ADD CONSTRAINT "Card_Activity_card_id_fkey" FOREIGN KEY ("card_id") REFERENCES "Cards"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card_Activity" ADD CONSTRAINT "Card_Activity_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
