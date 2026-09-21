/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `Barbershop` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Barbershop_phone_key" ON "Barbershop"("phone");
