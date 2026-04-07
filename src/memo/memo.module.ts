import { Module } from "@nestjs/common";
import { MemoController } from './memo.controller.js';
import { MemoService } from './memo.service.js';
import { UploadModule } from '../upload/upload.module.js';

@Module({
    imports: [UploadModule],
    controllers: [MemoController],
    providers: [MemoService]
})
export class MemoModule { }