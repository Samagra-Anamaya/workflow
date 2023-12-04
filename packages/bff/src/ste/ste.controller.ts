import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SteService } from './ste.service';
import { SchemeTransactionEventDto } from './dto/scheme.transaction.dto';
import { Public } from 'src/common/public.decorator';
import { Request } from 'express';
import { SteAuthGuard } from 'src/common/ste.auth-guard';
import { AuthDto } from './dto/auth.dto';

@UseGuards(SteAuthGuard)
@Controller('ste')
export class SteController {
  constructor(private readonly steService: SteService) {}

  @Public()
  @Post('/authenticate')
  async authenticate(@Body() authDto: AuthDto) {
    return await this.steService.authenticate(
      authDto.username,
      authDto.password,
    );
  }

  @Post('/saveSchemeTransaction')
  async saveSchemeTransaction(
    @Body() schemeTransactionDetail: SchemeTransactionEventDto,
    @Req() request: Request,
  ) {
    const userIdHeader = request.headers.userId;
    const userId: string = Array.isArray(userIdHeader)
      ? userIdHeader[0]
      : userIdHeader;
    return await this.steService.saveSchemeTransaction(
      schemeTransactionDetail.data,
      userId,
    );
  }

  @Get('/transactionHistory/:id')
  async getTransactionHistory(@Param('id') transactionHistoryid: string) {
    return await this.steService.getTransactionHistory(transactionHistoryid);
  }

  @Get('/progress')
  async getProgress(@Req() request: Request) {
    const userIdHeader = request.headers.userId;
    const userId: string = Array.isArray(userIdHeader)
      ? userIdHeader[0]
      : userIdHeader;
    return await this.steService.getProgress(userId);
  }
}
