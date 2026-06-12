/*
  Warnings:

  - You are about to drop the column `finished` on the `Score` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Score" DROP COLUMN "finished",
ADD COLUMN     "finishAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "expiresAt" SET DEFAULT now() + interval '2 weeks';
