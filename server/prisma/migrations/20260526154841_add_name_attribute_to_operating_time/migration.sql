/*
  Warnings:

  - Added the required column `name` to the `OperatingTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OperatingTime" ADD COLUMN     "name" TEXT NOT NULL;
