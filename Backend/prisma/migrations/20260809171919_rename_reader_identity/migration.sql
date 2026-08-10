/*
  Warnings:

  - You are about to drop the column `readerTokenHash` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[readerIdentity]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_readerTokenHash_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "readerTokenHash",
ADD COLUMN     "readerIdentity" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_readerIdentity_key" ON "User"("readerIdentity");
