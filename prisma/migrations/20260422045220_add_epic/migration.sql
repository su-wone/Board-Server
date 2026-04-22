-- AlterTable
ALTER TABLE "Cards" ADD COLUMN     "epicId" INTEGER;

-- CreateTable
CREATE TABLE "Epic" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,

    CONSTRAINT "Epic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Cards_epicId_idx" ON "Cards"("epicId");

-- AddForeignKey
ALTER TABLE "Cards" ADD CONSTRAINT "Cards_epicId_fkey" FOREIGN KEY ("epicId") REFERENCES "Epic"("id") ON DELETE SET NULL ON UPDATE CASCADE;
