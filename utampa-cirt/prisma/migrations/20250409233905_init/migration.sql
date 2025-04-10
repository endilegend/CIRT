-- CreateEnum
CREATE TYPE "Role" AS ENUM ('Reviewer', 'Author', 'Viewer');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Sent', 'Under_Review', 'Approved', 'Declined');

-- CreateEnum
CREATE TYPE "ArticleType" AS ENUM ('Article', 'Journal', 'Poster', 'Paper');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "f_name" VARCHAR(50) NOT NULL,
    "l_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "user_role" "Role" NOT NULL DEFAULT 'Author',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" SERIAL NOT NULL,
    "paper_name" VARCHAR(255) NOT NULL,
    "pdf_path" VARCHAR(255) NOT NULL,
    "author_id" TEXT,
    "status" "Status",
    "type" "ArticleType",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Keyword" (
    "id" SERIAL NOT NULL,
    "article_id" INTEGER,
    "keyword" VARCHAR(50) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "review_ID" SERIAL NOT NULL,
    "article_id" INTEGER NOT NULL,
    "reviewerId" TEXT NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("review_ID")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Keyword" ADD CONSTRAINT "Keyword_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
