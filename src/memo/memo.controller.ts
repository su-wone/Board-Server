import { Controller, Get, Post, Patch, Delete, Body, Param, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { MemoService } from './memo.service.js';
import { UploadService } from '../upload/upload.service.js';

@Controller('memos')
export class MemoController {
    constructor(
        private memoService: MemoService,
        private uploadService: UploadService,
    ) { }

    @Get()
    findAll() {
        return this.memoService.findAll();
    }

    @Post()
    @UseInterceptors(FilesInterceptor('images', 5))
    async create(@Body('text') text: string, @UploadedFiles() files: Express.Multer.File[]) {
        const imageUrls = await Promise.all(
            files.map(file => this.uploadService.uploadFile(file)),
        );
        return this.memoService.create(text, imageUrls);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body('text') text: string) {
        return this.memoService.update(Number(id), text);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.memoService.remove(Number(id));
    }

    @Post(':id/images')
    @UseInterceptors(FilesInterceptor('images', 5))
    async addImages(@Param('id') id: string, @UploadedFiles() files: Express.Multer.File[]) {
        const imageUrls = await Promise.all(
            files.map(file => this.uploadService.uploadFile(file)),
        );
        return this.memoService.addImages(Number(id), imageUrls);
    }

    @Delete('images/:imageId')
    removeImage(@Param('imageId') imageId: string) {
        return this.memoService.removeImage(Number(imageId));
    }
}