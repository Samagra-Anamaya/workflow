// upload.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MinioService } from 'src/minio/minio.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly minioService: MinioService,
    private readonly configService: ConfigService,
  ) {}

  async uploadFile(filename: string, buffer: Buffer) {
    const result = await this.minioService.uploadFile(
      this.configService.get<string>('MINIO_BUCKET'),
      filename,
      buffer,
    );
    return result;
  }

  async uploadFiles(files: any, meta: any) {
    try {
      const urls = await Promise.all(
        files.map(async (file) => {
          const result = await this.minioService.uploadFile(
            this.configService.get<string>('MINIO_BUCKET'),
            file.originalname,
            file.buffer,
            meta,
          );
          return result;
        }),
      );
      return { result: urls };
    } catch (error) {
      throw error;
    }
  }

  async getMediaUrl(filename: string) {
    return await this.minioService.getFileLink(
      this.configService.get<string>('MINIO_BUCKET'),
      filename,
    );
  }
}
