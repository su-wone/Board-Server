import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

const SPRINT_SELECT = {
    id: true,
    title: true,
    status: true,
    startDate: true,
    endDate: true,
    _count: {
        select: {
            cards: { where: { deletedAt: null } },
        },
    },
} as const;

@Injectable()
export class SprintsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const sprints = await this.prisma.sprints.findMany({
            where: { deletedAt: null },
            orderBy: { startDate: 'asc' },
            select: SPRINT_SELECT,
        });

        return sprints.map(({ _count, title, ...sprint }) => ({
            ...sprint,
            name: title,
            cardCount: _count.cards,
        }));
    }

    async findOne(id: number) {
        const sprint = await this.prisma.sprints.findFirst({
            where: { id, deletedAt: null },
            select: SPRINT_SELECT,
        });

        if (!sprint) {
            throw new NotFoundException('스프린트를 찾을 수 없습니다');
        }

        const { _count, title, ...rest } = sprint;
        return { ...rest, name: title, cardCount: _count.cards };
    }
}