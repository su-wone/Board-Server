import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class EpicsService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.epic.findMany({
            orderBy: { id: 'asc' },
            select: { id: true, name: true, color: true },
        });
    }
}
