import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class MemoService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.memo.findMany({
            include: { memoImages: { orderBy: { order: 'asc' } } },
        });
    }

    create(text: string, imageUrls: string[] = []) {
        if (imageUrls.length > 5) {
            throw new BadRequestException('이미지는 최대 5개까지 가능합니다');
        }
        return this.prisma.memo.create({
            data: {
                text,
                memoImages: {
                    create: imageUrls.map((url, index) => ({ url, order: index })),
                },
            },
            include: { memoImages: true },
        });
    }

    update(id: number, text: string) {
        return this.prisma.memo.update({ where: { id }, data: { text } });
    }

    remove(id: number) {
        return this.prisma.memo.delete({ where: { id } });
    }

    async addImages(memoId: number, imageUrls: string[]) {
        const memo = await this.prisma.memo.findUnique({
            where: { id: memoId },
            include: { memoImages: true },
        });
        if (!memo) {
            throw new NotFoundException('메모를 찾을 수 없습니다');
        }
        const currentCount = memo.memoImages.length;
        if (currentCount + imageUrls.length > 5) {
            throw new BadRequestException(
                `이미지는 최대 5개까지 가능합니다 (현재 ${currentCount}개)`,
            );
        }
        return this.prisma.memo.update({
            where: { id: memoId },
            data: {
                memoImages: {
                    create: imageUrls.map((url, index) => ({
                        url,
                        order: currentCount + index,
                    })),
                },
            },
            include: { memoImages: { orderBy: { order: 'asc' } } },
        });
    }

    removeImage(imageId: number) {
        return this.prisma.memoImage.delete({ where: { id: imageId } });
    }
}