-- CreateEnum
CREATE TYPE "MagazinePageType" AS ENUM ('COVER', 'HIGHLIGHTS', 'ABOUT', 'PRIVACY', 'CONTACT', 'CONTENTS', 'ARTICLE', 'AD', 'STATIC');

-- CreateTable
CREATE TABLE "MagazineIssue" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "issueNumber" INTEGER,
    "volume" TEXT,
    "coverUrl" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagazineIssue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MagazinePage" (
    "id" TEXT NOT NULL,
    "issueId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "type" "MagazinePageType" NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "articleId" TEXT,
    "content" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MagazinePage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MagazineIssue_slug_key" ON "MagazineIssue"("slug");

-- CreateIndex
CREATE INDEX "MagazineIssue_publishedAt_idx" ON "MagazineIssue"("publishedAt");

-- CreateIndex
CREATE INDEX "MagazinePage_issueId_idx" ON "MagazinePage"("issueId");

-- CreateIndex
CREATE INDEX "MagazinePage_articleId_idx" ON "MagazinePage"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "MagazinePage_issueId_position_key" ON "MagazinePage"("issueId", "position");

-- AddForeignKey
ALTER TABLE "MagazinePage" ADD CONSTRAINT "MagazinePage_issueId_fkey" FOREIGN KEY ("issueId") REFERENCES "MagazineIssue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MagazinePage" ADD CONSTRAINT "MagazinePage_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
