/*
  Warnings:

  - The values [Viewer] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('Reviewer', 'Author', 'Editor');
ALTER TABLE "User" ALTER COLUMN "user_role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "user_role" TYPE "Role_new" USING ("user_role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "user_role" SET DEFAULT 'Author';
COMMIT;

-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'Reviewed';

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "comments" TEXT;
