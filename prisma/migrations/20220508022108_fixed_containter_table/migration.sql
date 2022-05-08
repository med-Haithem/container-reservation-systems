/*
  Warnings:

  - You are about to drop the column `Postion` on the `Container` table. All the data in the column will be lost.
  - Added the required column `Position` to the `Container` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Container" DROP COLUMN "Postion",
ADD COLUMN     "Position" TEXT NOT NULL;
