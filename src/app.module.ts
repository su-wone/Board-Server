import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MemoModule } from './memo/memo.module.js';

@Module({
  imports: [PrismaModule, MemoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
