/*
  Warnings:

  - You are about to drop the column `barbershopId` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the `Barbershop` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `barbershopId` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_barbershopId_fkey";

-- AlterTable
ALTER TABLE "Employee" DROP COLUMN "barbershopId",
ADD COLUMN     "barbershopId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Barbershop";

-- CreateTable
CREATE TABLE "Barbershop" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "customerId" TEXT,
    "image" TEXT,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barbershop_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_email_key" ON "Barbershop"("email");

-- CreateIndex
CREATE INDEX "Barbershop_email_idx" ON "Barbershop"("email");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_barbershopId_fkey" FOREIGN KEY ("barbershopId") REFERENCES "Barbershop"("id") ON DELETE CASCADE ON UPDATE CASCADE;
