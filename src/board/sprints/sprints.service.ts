import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class SprintsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const sprints = await this.prisma.sprints.findMany({
            where: { deletedAt: null },
            orderBy: { startDate: 'asc' },
            include: {
                _count: {
                    select: {
                        cards: { where: { deletedAt: null } },
                    },
                },
            },
        });

        return sprints.map(({ _count, ...sprint }) => ({
            ...sprint,
            cardCount: _count.cards,
        }));
    }

    async findOne(id: number) {
        const sprint = await this.prisma.sprints.findFirst({
            where: { id, deletedAt: null },
            include: {
                _count: {
                    select: {
                        cards: { where: { deletedAt: null } },
                    },
                },
            },
        });

        if (!sprint) {
            throw new NotFoundException('스프린트를 찾을 수 없습니다');
        }

        const { _count, ...rest } = sprint;
        return { ...rest, cardCount: _count.cards };
    }
}