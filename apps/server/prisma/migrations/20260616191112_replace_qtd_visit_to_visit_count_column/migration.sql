/*
  Warnings:

  - You are about to drop the column `qtdVisit` on the `Customer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Customer" DROP COLUMN "qtdVisit",
ADD COLUMN     "visitCount" INTEGER NOT NULL DEFAULT 1;
