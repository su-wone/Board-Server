import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MemoModule } from './memo/memo.module.js';

@Module({
  imports: [PrismaModule, MemoModule],
})
export class AppModule { }
