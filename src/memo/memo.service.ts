import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class MemoService {
    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.memo.findMany();
    }

    create(text: string) {
        return this.prisma.memo.create({ data: { text } });
    }

    update(id: number, text: string) {
        return this.prisma.memo.update({ where: { id }, data: { text } });
    }

    remove(id: number) {
        return this.prisma.memo.delete({ where: { id } });
    }
}