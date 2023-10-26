import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class FileUploadDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  @IsNotEmpty()
  image: any;
}

export class MultiFileUploadDto {
  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsNotEmpty()
  files: Express.Multer.File[];

  @ApiProperty()
  @IsNotEmpty()
  meta: any; // or any other desired type, perhaps an object: meta: Record<string, any>;
}
