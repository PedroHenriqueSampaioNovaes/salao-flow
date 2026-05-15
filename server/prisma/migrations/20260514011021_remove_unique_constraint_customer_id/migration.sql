-- DropIndex
DROP INDEX "User_customerId_key";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "customerId" DROP NOT NULL;
