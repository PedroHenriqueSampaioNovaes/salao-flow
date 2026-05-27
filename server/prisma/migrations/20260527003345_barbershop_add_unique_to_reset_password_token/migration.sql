/*
  Warnings:

  - A unique constraint covering the columns `[resetPasswordToken]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_resetPasswordToken_key" ON "Barbershop"("resetPasswordToken");
