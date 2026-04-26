import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { CreateCardDto } from './dto/create-card.dto.js';
import { CardsFilterDto } from './dto/cards-filter.dto.js';
import { Prisma } from '../../../generated/prisma/client.js';

const CARD_SELECT = {
    id: true,
    title: true,
    type: true,
    priority: true,
    workflowId: true,
    sprintId: true,
    description: true,
    dueDate: true,
    storyPoint: true,
    order: true,
    assignee: { select: { id: true, name: true } },
    reporter: { select: { id: true, name: true } },
    labels: { select: { id: true, name: true, color: true } },
    workflow: { select: { id: true, title: true } },
    epic: { select: { id: true, name: true, color: true } },
} as const;

function toCardResponse({ workflow, ...card }: { workflow: { title: string }; id: number;[k: string]: unknown }) {
    return { ...card, status: workflow.title, key: `VEASLY-${card.id}` };
}

@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }

    async findAll(filter: CardsFilterDto) {
        const where: Prisma.CardsWhereInput = {
            deletedAt: null,
        };

        if (filter.sprintId === 'null') {
            where.sprintId = null;
        } else if (filter.sprintId !== undefined) {
            where.sprintId = Number(filter.sprintId);
        }

        const cards = await this.prisma.cards.findMany({
            where,
            orderBy: [{ workflowId: 'asc' }, { order: 'asc' }],
            select: CARD_SELECT,
        });

        return cards.map(toCardResponse);
    }

    async findOne(id: number) {
        const card = await this.prisma.cards.findFirst({
            where: { id, deletedAt: null },
            select: {
                ...CARD_SELECT,
                parent: { select: { id: true, title: true, type: true } },
                children: { select: { id: true, title: true, type: true } },
            },
        });

        if (!card) {
            throw new NotFoundException(`card id ${id} not found`);
        }

        return toCardResponse(card);
    }

    async create(dto: CreateCardDto) {
        const workflow = await this.prisma.workflows.findFirst({
            where: { id: dto.workflowId, deletedAt: null },
        });
        if (!workflow) {
            throw new NotFoundException(`workflowId ${dto.workflowId} not found`);
        }

        if (dto.sprintId != null) {
            const sprint = await this.prisma.sprints.findFirst({
                where: { id: dto.sprintId, deletedAt: null },
            });
            if (!sprint) {
                throw new NotFoundException(`sprintId ${dto.sprintId} not found`);
            }
        }

        if (dto.epicId !== undefined) {
            const epic = await this.prisma.epic.findUnique({
                where: { id: dto.epicId },
            });
            if (!epic) {
                throw new NotFoundException(`epicId ${dto.epicId} not found`);
            }
        }

        const max = await this.prisma.cards.aggregate({
            where: {
                workflowId: dto.workflowId,
                sprintId: dto.sprintId,
                deletedAt: null,
            },
            _max: { order: true },
        });
        const nextOrder = (max._max.order ?? 0) + 1;

        const created = await this.prisma.cards.create({
            data: {
                title: dto.title,
                workflowId: dto.workflowId,
                sprintId: dto.sprintId,
                type: dto.type,
                priority: dto.priority,
                epicId: dto.epicId,
                order: nextOrder,
            },
            select: {
                id: true,
                title: true,
                type: true,
                priority: true,
                workflowId: true,
                sprintId: true,
                epicId: true,
            },
        });

        return { ...created, key: `VEASLY-${created.id}` };
    }
}
