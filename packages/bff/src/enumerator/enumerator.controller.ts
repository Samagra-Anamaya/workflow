import { Controller } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EnumeratorService } from './enumerator.service';

@Controller('enumerator')
export class EnumeratorController {
  //constructor(private readonly enumeratorService: EnumeratorService) {}

  constructor(
    private readonly prisma: PrismaService,
    private readonly enumeratorService: EnumeratorService,
  ) {}

  // @Get()
  // async findAll(): Promise<any> {
  //   const users = await this.prisma.user.findMany();
  //   return users;
  // }

  // @Post()
  // async create(@Body() user: any): Promise<any> {
  //   const newUser = await this.prisma.user.create({
  //     data: user,
  //   });

  //   return newUser;
  // }

  // @Post('createEnumerators')
  // async createEnumerators(@Body() user: any): Promise<any> {
  //   return this.enumeratorService.createUser(user);
  // }

  // @Post('admin')
  // async createAdmin(@Body() user: any): Promise<any> {
  //   const newUser = await this.prisma.admin.create({
  //     data: user,
  //   });

  //   return newUser;
  // }

  // @Get('admin')
  // async findAllAdmin(): Promise<any> {
  //   const users = await this.prisma.admin.findMany();
  //   return users;
  // }
}
