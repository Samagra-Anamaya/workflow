import { ApiProperty } from '@nestjs/swagger';
import { JsonArray } from '@prisma/client/runtime/library';

export class SchemeTransactionEvent {
  @ApiProperty({
    example: 'CULC8',
  })
  schemeCode: string;

  @ApiProperty({
    example: '123412341234',
    description: '12 Digit Aadhaar Number',
  })
  aadhaarNumber: string;

  @ApiProperty({
    example: '1234123412345',
    description: '13 Digit Aadhaar Reference Number',
  })
  aadhaarReferenceNumber: string;

  @ApiProperty({
    example: '123456',
  })
  uniqueBeneficiaryId: string;

  @ApiProperty({
    example: '2022-23',
    description: 'Financial year in YYYY-YY format',
  })
  financialYear: string;

  @ApiProperty({
    example: 'Cash',
  })
  transactionType: string;

  @ApiProperty({
    example: 5000,
    description: 'Transaction Amount',
  })
  transactionAmount: number;

  @ApiProperty({
    example: 'Training',
  })
  inKindBenefitDetail: string;

  @ApiProperty({
    example: '12-05-2023',
    description: 'Transaction date in DD-MM-YYYY format',
  })
  transactionDate: string;

  @ApiProperty({
    type: String,
  })
  remarks = '';

  @ApiProperty({
    type: [],
    example: [
      {
        marker: 'Date of Birth',
        value: '21-01-1999',
      },
    ],
    description: 'These are department specific marker-value pairs',
  })
  departmentData: JsonArray = [];
}

export class SchemeTransactionEventDto {
  @ApiProperty({
    type: [SchemeTransactionEvent],
  })
  data: SchemeTransactionEvent[];
}
