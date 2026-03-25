import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { MemoService } from './memo.service.js';

@Controller('memos')
export class MemoController {
    constructor(private memoService: MemoService) { }

    @Get()
    findAll() {
        return this.memoService.findAll();
    }

    @Post()
    create(@Body('text') text: string) {
        return this.memoService.create(text);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body('text') text: string) {
        return this.memoService.update(Number(id), text);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.memoService.remove(Number(id));
    }
}