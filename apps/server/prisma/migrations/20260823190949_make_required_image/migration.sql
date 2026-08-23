/*
  Warnings:

  - Made the column `image` on table `Employee` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Employee" ALTER COLUMN "image" SET NOT NULL;
