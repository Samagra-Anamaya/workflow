import { ApiProperty } from '@nestjs/swagger';
import { SubmissionStatus } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';

export class FeedbackDto {
  @IsNotEmpty()
  @ApiProperty({
    description: 'Set submission status to FLAGGED, VERIFIED, FAILED',
    example: 'VERIFIED',
  })
  flag: SubmissionStatus;

  @ApiProperty({
    description: 'JSON object, in case of FLAGGED feedback',
  })
  feedbackBody: any;
}
