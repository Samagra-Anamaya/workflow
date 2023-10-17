import {
  BadRequestException,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileUploadDto, MultiFileUploadDto } from './dto/upload.dto';
import { AuthGuard } from 'src/common/auth-gaurd';

@Controller('upload')
@ApiBearerAuth()
@UseGuards(AuthGuard)
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get()
  async hello(): Promise<any> {
    return 'hello';
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: FileUploadDto,
  })
  @UseInterceptors(FileInterceptor('image'))
  async createSubmission(
    @UploadedFile() image: Express.Multer.File,
  ): Promise<any> {
    const result = await this.uploadService.uploadFile(
      image.originalname,
      image.buffer,
    );

    return result;
  }

  @Post('/multiple')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Upload File',
    type: MultiFileUploadDto,
  })
  @UseInterceptors(FilesInterceptor('files'))
  async upload(@UploadedFiles() files: Express.Multer.File[]) {
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
