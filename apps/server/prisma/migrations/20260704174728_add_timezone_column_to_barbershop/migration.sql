/*
  Warnings:

  - Added the required column `timezone` to the `Barbershop` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Barbershop" ADD COLUMN     "timezone" TEXT DEFAULT 'America/Sao_Paulo' NOT NULL;
