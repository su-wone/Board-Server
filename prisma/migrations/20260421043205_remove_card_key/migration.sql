/*
  Warnings:

  - You are about to drop the column `key` on the `Cards` table. All the data in the column will be lost.
  - The `type` column on the `Cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `priority` column on the `Cards` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `status` column on the `Sprints` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `MemoImages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Memos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Labels` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SprintStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'DONE');

-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('EPIC', 'STORY', 'TASK', 'SUB_TASK', 'BUG');

-- CreateEnum
CREATE TYPE "CardPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- DropForeignKey
ALTER TABLE "MemoImages" DROP CONSTRAINT "MemoImages_memoId_fkey";

-- DropIndex
DROP INDEX "Cards_key_key";

-- AlterTable
ALTER TABLE "Cards" DROP COLUMN "key",
DROP COLUMN "type",
ADD COLUMN     "type" "CardType" NOT NULL DEFAULT 'TASK',
DROP COLUMN "priority",
ADD COLUMN     "priority" "CardPriority" NOT NULL DEFAULT 'MEDIUM';

-- AlterTable
ALTER TABLE "Sprints" ADD COLUMN     "goal" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "SprintStatus" NOT NULL DEFAULT 'PLANNED',
ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "endDate" DROP NOT NULL;

-- DropTable
DROP TABLE "MemoImages";

-- DropTable
DROP TABLE "Memos";

-- CreateIndex
CREATE INDEX "Cards_workflowId_idx" ON "Cards"("workflowId");

-- CreateIndex
CREATE INDEX "Cards_sprintId_idx" ON "Cards"("sprintId");

-- CreateIndex
CREATE INDEX "Cards_assigneeId_idx" ON "Cards"("assigneeId");

-- CreateIndex
CREATE INDEX "Cards_reporterId_idx" ON "Cards"("reporterId");

-- CreateIndex
CREATE INDEX "Cards_parentId_idx" ON "Cards"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Labels_name_key" ON "Labels"("name");
