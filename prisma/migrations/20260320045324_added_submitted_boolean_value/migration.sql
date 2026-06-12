-- AlterTable
ALTER TABLE "Score" ADD COLUMN     "submitted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 weeks';
