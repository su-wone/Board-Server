import { Module } from "@nestjs/common";
import { MemoController } from './memo.controller.js';
import { MemoService } from './memo.service.js';

@Module({
    controllers: [MemoController],
    providers: [MemoService],
})
export class MemoModule { }