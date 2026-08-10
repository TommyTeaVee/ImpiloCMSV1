/*
  Warnings:

  - You are about to drop the column `readerIdentity` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[readerTokenHash]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_readerIdentity_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "readerIdentity",
ADD COLUMN     "readerTokenHash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_readerTokenHash_key" ON "User"("readerTokenHash");
