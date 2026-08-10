/*
  Warnings:

  - Added the required column `provider` to the `MediaAsset` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MediaAsset" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "provider" TEXT NOT NULL;
