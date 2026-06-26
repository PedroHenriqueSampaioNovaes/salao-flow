/*
  Warnings:

  - A unique constraint covering the columns `[email,barbershopId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Customer_email_key";

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_barbershopId_key" ON "Customer"("email", "barbershopId");
