import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get()
  async hello(): Promise<any> {
    return 'hello';
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async createSubmission(@UploadedFile() image: any): Promise<any> {
    const result = await this.uploadService.uploadFile(
      image.originalname,
      image.buffer,
    );

    return result;
  }

  @Post('/multiple')
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files) {
    try {
      if (!files || files?.length === 0)
        throw new BadRequestException('No Files passed');
      const urls = await this.uploadService.uploadFiles(files);
      return urls;
    } catch (error) {
      throw error;
    }
  }
}
