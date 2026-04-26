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

function toSprintResponse({ _count, title, ...sprint }: { _count: { cards: number }; title: string;[k: string]: unknown }) {
    return { ...sprint, name: title, cardCount: _count.cards };
}

@Injectable()
export class SprintsService {
    constructor(private prisma: PrismaService) { }

    async findAll() {
        const sprints = await this.prisma.sprints.findMany({
            where: { deletedAt: null },
            orderBy: { startDate: 'asc' },
            select: SPRINT_SELECT,
        });

        return sprints.map(toSprintResponse);
    }

    async findOne(id: number) {
        const sprint = await this.prisma.sprints.findFirst({
            where: { id, deletedAt: null },
            select: SPRINT_SELECT,
        });

        if (!sprint) {
            throw new NotFoundException('스프린트를 찾을 수 없습니다');
        }

        return toSprintResponse(sprint);
    }
}