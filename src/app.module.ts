import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { BoardModule } from './board/board.module.js';

@Module({
  imports: [PrismaModule, BoardModule],
})
export class AppModule { }
