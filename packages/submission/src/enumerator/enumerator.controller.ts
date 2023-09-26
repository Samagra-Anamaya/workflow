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
    const newUser = await this.prisma.user.create({
      data: user,
    });

    return newUser;
  }

  @Post('admin')
  async createAdmin(@Body() user: any): Promise<any> {
    const newUser = await this.prisma.admin.create({
      data: user,
    });

    return newUser;
  }

  @Get('admin')
  async findAllAdmin(): Promise<any> {
    const users = await this.prisma.admin.findMany();
    return users;
  }
}
