/*
  Warnings:

  - You are about to drop the column `photoUrl` on the `orders` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[attachmentId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "photoUrl",
ADD COLUMN     "attachmentId" TEXT;

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orders_attachmentId_key" ON "orders"("attachmentId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "attachments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
