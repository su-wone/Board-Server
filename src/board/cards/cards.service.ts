import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

export interface CardsFilter {
    sprintId?: string;
}

@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }

    findAll(filter: CardsFilter) {
        const where: { deletedAt: null; sprintId?: number | null } = {
            deletedAt: null,
        };

        if (filter.sprintId === 'null') {
            where.sprintId = null;
        } else if (filter.sprintId !== undefined) {
            where.sprintId = Number(filter.sprintId);
        }

        return this.prisma.cards.findMany({
            where,
            orderBy: [{ workflowId: 'asc' }, { order: 'asc' }],
        });
    }
}