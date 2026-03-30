import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
    private s3: S3Client;
    private bucketName: string;

    constructor() {
        this.s3 = new S3Client({
            region: process.env.AWS_S3_REGION!,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
        });
        this.bucketName = process.env.AWS_S3_BUCKET_NAME!;
    }

    async uploadFile(file: Express.Multer.File): Promise<string> {
        const fileName = `${randomUUID()}-${file.originalname}`;

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3.send(command);

        return `https://${this.bucketName}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${fileName}`;
    }
}