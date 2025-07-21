/*
  Warnings:

  - You are about to drop the column `productId` on the `Counter` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Counter` table. All the data in the column will be lost.
  - Added the required column `counterBgColor` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `counterStyleSelected` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `counterText` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `counterTextColor` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Counter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Counter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Counter" DROP COLUMN "productId",
DROP COLUMN "updatedAt",
ADD COLUMN     "counterBgColor" TEXT NOT NULL,
ADD COLUMN     "counterStyleSelected" TEXT NOT NULL,
ADD COLUMN     "counterText" TEXT NOT NULL,
ADD COLUMN     "counterTextColor" TEXT NOT NULL,
ADD COLUMN     "endTime" TEXT NOT NULL,
ADD COLUMN     "products" INTEGER[],
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TEXT NOT NULL;
