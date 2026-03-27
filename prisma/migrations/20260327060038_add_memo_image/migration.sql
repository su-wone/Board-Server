-- CreateTable
CREATE TABLE "MemoImage" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "memoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MemoImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MemoImage" ADD CONSTRAINT "MemoImage_memoId_fkey" FOREIGN KEY ("memoId") REFERENCES "Memo"("id") ON DELETE CASCADE ON UPDATE CASCADE;
