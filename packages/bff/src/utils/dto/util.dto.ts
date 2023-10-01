import { ApiProperty } from '@nestjs/swagger';

export enum VillageDataStatus {
  ASSIGNED = 'ASSIGNED',
  COMPLETED = 'COMPLETED',
  PROCESSING = 'PROCESSING',
  UNASSIGNED = 'UNASSIGNED',
}
export class CreateVillageDto {
  @ApiProperty()
  stateCode: number;

  @ApiProperty()
  stateName: string;

  @ApiProperty()
  districtCode: number;

  @ApiProperty()
  districtName: string;

  @ApiProperty()
  itdaName: string;

  @ApiProperty()
  blockCode: number;

  @ApiProperty()
  blockName: string;

  @ApiProperty({ default: 'N' })
  isTspBlock: 'Y' | 'N';

  @ApiProperty()
  gpCode: number;

  @ApiProperty()
  gpName: string;

  @ApiProperty()
  surveySubmitted?: number;

  @ApiProperty()
  surveyToConduct?: number;

  @ApiProperty()
  spdpVillageId: number;

  @ApiProperty()
  villageName: string;

  @ApiProperty({ default: VillageDataStatus.UNASSIGNED })
  status: VillageDataStatus;
}
