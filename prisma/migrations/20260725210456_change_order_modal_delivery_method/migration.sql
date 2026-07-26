/*
  Warnings:

  - The values [DELIVERY] on the enum `DeliveryMethod` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DeliveryMethod_new" AS ENUM ('ADDRESS', 'PICKUP');
ALTER TABLE "public"."order" ALTER COLUMN "deliveryMethod" DROP DEFAULT;
ALTER TABLE "order" ALTER COLUMN "deliveryMethod" TYPE "DeliveryMethod_new" USING ("deliveryMethod"::text::"DeliveryMethod_new");
ALTER TYPE "DeliveryMethod" RENAME TO "DeliveryMethod_old";
ALTER TYPE "DeliveryMethod_new" RENAME TO "DeliveryMethod";
DROP TYPE "public"."DeliveryMethod_old";
ALTER TABLE "order" ALTER COLUMN "deliveryMethod" SET DEFAULT 'ADDRESS';
COMMIT;

-- AlterTable
ALTER TABLE "order" ALTER COLUMN "deliveryMethod" SET DEFAULT 'ADDRESS';
