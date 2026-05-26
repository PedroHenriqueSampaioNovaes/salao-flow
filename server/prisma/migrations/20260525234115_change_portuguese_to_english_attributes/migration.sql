/*
  Warnings:

  - You are about to drop the column `fim` on the `OperatingTime` table. All the data in the column will be lost.
  - You are about to drop the column `fimAlmoco` on the `OperatingTime` table. All the data in the column will be lost.
  - You are about to drop the column `inicio` on the `OperatingTime` table. All the data in the column will be lost.
  - You are about to drop the column `inicioAlmoco` on the `OperatingTime` table. All the data in the column will be lost.
  - Added the required column `end` to the `OperatingTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endLunch` to the `OperatingTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `start` to the `OperatingTime` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startLunch` to the `OperatingTime` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OperatingTime" DROP COLUMN "fim",
DROP COLUMN "fimAlmoco",
DROP COLUMN "inicio",
DROP COLUMN "inicioAlmoco",
ADD COLUMN     "end" TEXT NOT NULL,
ADD COLUMN     "endLunch" TEXT NOT NULL,
ADD COLUMN     "start" TEXT NOT NULL,
ADD COLUMN     "startLunch" TEXT NOT NULL;
