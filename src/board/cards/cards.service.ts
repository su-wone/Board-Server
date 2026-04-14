import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';

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

    async create(dto: CreateCardDto) {
        return this.prisma.$transaction(async (tx) => {
            const workflow = await tx.workflows.findFirst({
                where: { id: dto.workflowId, deletedAt: null },
            });
            if (!workflow) {
                throw new NotFoundException(`workflowId ${dto.workflowId} not found`);
            }

            if (dto.sprintId !== null) {
                const sprint = await tx.sprints.findFirst({
                    where: { id: dto.sprintId, deletedAt: null },
                });
                if (!sprint) {
                    throw new NotFoundException(`sprintId ${dto.sprintId} not found`);
                }
            }

            const max = await tx.cards.aggregate({
                where: {
                    workflowId: dto.workflowId,
                    sprintId: dto.sprintId,
                    deletedAt: null,
                },
                _max: { order: true },
            });
            const nextOrder = (max._max.order ?? 0) + 1;

            const created = await tx.cards.create({
                data: {
                    title: dto.title,
                    workflowId: dto.workflowId,
                    sprintId: dto.sprintId,
                    type: dto.type ?? 'STORY',
                    priority: dto.priority ?? 'MEDIUM',
                    order: nextOrder,
                    key: '__tmp__',
                },
            });

            return tx.cards.update({
                where: { id: created.id },
                data: { key: `BOARD-${created.id}` },
            });
        });
    }
}
