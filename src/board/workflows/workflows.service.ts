import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class WorkflowsService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.workflows.findMany({
            where: { deletedAt: null },
            orderBy: { order: 'asc' },
        });
    }
}