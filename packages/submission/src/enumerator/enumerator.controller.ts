import { Controller, Get, Post, Body } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('enumerator')
export class EnumeratorController {
  //constructor(private readonly enumeratorService: EnumeratorService) {}
  constructor(private readonly prisma: PrismaService) {}
  @Get()
  async findAll(): Promise<any> {
    const users = await this.prisma.user.findMany();
    return users;
  }

  @Post()
  async create(@Body() user: any): Promise<any> {
    const newSubmission = await this.prisma.user.create({
      data: user,
    });

    return newSubmission;
  }
}
