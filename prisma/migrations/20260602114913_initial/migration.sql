-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('WAITING', 'PICKED_UP', 'DELIVERED', 'RETURNED');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "couriers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recipients" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'WAITING',
    "photoUrl" TEXT,
    "deliveryLatitude" DOUBLE PRECISION NOT NULL,
    "deliveryLongitude" DOUBLE PRECISION NOT NULL,
    "recipientId" TEXT NOT NULL,
    "courierId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "recipientId" TEXT NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_cpf_key" ON "admins"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "couriers_cpf_key" ON "couriers"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "recipients_email_key" ON "recipients"("email");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_courierId_fkey" FOREIGN KEY ("courierId") REFERENCES "couriers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "recipients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
