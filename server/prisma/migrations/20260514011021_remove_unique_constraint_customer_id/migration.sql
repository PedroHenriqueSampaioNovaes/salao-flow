-- DropIndex
DROP INDEX "Barbershop_customerId_key";

-- AlterTable
ALTER TABLE "Barbershop" ALTER COLUMN "customerId" DROP NOT NULL;
