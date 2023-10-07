import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, Min } from 'class-validator';
export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

export class SubmissionData {
  @ApiProperty()
  beneficiaryName: string;

  @ApiProperty({ default: new Date() })
  dateOfBirth: Date;

  @ApiProperty({ minLength: 16 })
  aadharNumber: string;

  @ApiProperty({ default: 'manual' })
  mode: 'qr' | 'manual';

  @ApiProperty({ enum: ['male', 'female', 'other'] })
  gender: Gender;
}

export class CreateSubmissionDto {
  @ApiProperty({ default: 'gp_115550' })
  submitterId: string;

  @ApiProperty({ default: new Date() })
  capturedAt: Date;
  @ApiProperty({
    description: 'Village Id',
    default: 404281,
  })
  spdpVillageId: number;

  @ApiProperty()
  citizenId: string;

  @ApiProperty()
  submissionData: SubmissionData;
}

export class GetAllSubmissionsDto {
  @IsString()
  @ApiProperty({
    description: 'Page No.',
    example: '1',
  })
  page: number = 1;

  @IsInt()
  @ApiProperty({
    description: 'No. of records per page',
    example: '10',
  })
  @Min(1)
  limit: number = 10;
}

// citizen.dto.ts

export class UpdateSubmissionIdDto {
  @IsString()
  @ApiProperty({
    description: 'Submission Id',
    example: '59d28246-c7b0-45dc-9225-985bfea2bc5c',
  })
  id: string; // Set your default value here
}

export class UpdateSubmissionDto {
  @ApiProperty()
  data: SubmissionData;
}