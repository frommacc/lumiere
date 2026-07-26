/*
  Warnings:

  - You are about to drop the column `notes` on the `order_item` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[orderNumber]` on the table `order` will be added. If there are existing duplicate values, this will fail.
  - The required column `orderNumber` was added to the `order` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `phone` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtotal` to the `order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `order_item` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('DELIVERY', 'PICKUP');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('CASH', 'CARD');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'READY';
ALTER TYPE "OrderStatus" ADD VALUE 'IN_TRANSIT';

-- AlterTable
ALTER TABLE "order" ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "deliveryAddress" TEXT,
ADD COLUMN     "deliveryFee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'DELIVERY',
ADD COLUMN     "orderNumber" TEXT NOT NULL,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "subtotal" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "notes",
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "order_orderNumber_key" ON "order"("orderNumber");

-- CreateIndex
CREATE INDEX "order_status_idx" ON "order"("status");
