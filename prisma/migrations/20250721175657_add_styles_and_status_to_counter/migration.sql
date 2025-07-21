/*
  Warnings:

  - Added the required column `colonStyle` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `counterBoxStyle` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scriptId` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeStyle` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Counter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Counter" ADD COLUMN     "colonStyle" JSONB NOT NULL,
ADD COLUMN     "counterBoxStyle" JSONB NOT NULL,
ADD COLUMN     "scriptId" INTEGER NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ADD COLUMN     "timeStyle" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
