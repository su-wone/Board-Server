import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { MemoModule } from './memo/memo.module.js';
import { UploadModule } from './upload/upload.module.js';

@Module({
  imports: [PrismaModule, MemoModule, UploadModule],
})
export class AppModule { }
