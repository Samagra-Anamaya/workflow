// user.service.ts (or user.controller.ts)
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class EnumeratorService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({
      data,
    });
  }

  async createUsersForVillages(
    data: any,
    count: number,
    code: number,
  ): Promise<any> {
    const users = [];
    console.log({ count, code });
    for (let i = 1; i <= count; i++) {
      // if(i===1){
      //   console.log({data});
      // }
      users.push({
        userId: `${code}_${i}`,
        password: `${code}_${i}`,
        meta: {
          gpCode: code,
          village: data?.[i]?.spdpVillageId,
          name: 'hello',
        },
      });
    }

    return users;
  }

  async getUsersFromGpCode(distinctGpCodes: any): Promise<any> {
    let users = [];
    for (let i = 0; i < distinctGpCodes.length; i++) {
      const rec = distinctGpCodes[i];

      const code = rec.gpCode;
      const villageUnderGp = await this.prisma.villageData.findMany({
        where: {
          gpCode: code,
        },
      });

      const usersForGp = await this.createUsersForVillages(
        villageUnderGp,
        rec._count.gpCode,
        code,
      );

      users = [...users, ...usersForGp];
    }

    return users;
  }

  async createEnumerators(): Promise<any> {
    try {
      const distinctGpCodes = await this.prisma.villageData.groupBy({
        by: ['gpCode'], // Replace 'name' with the actual column name you want to group by
        _count: {
          gpCode: true,
        },
      });

      const users = await this.getUsersFromGpCode(distinctGpCodes);

      const enumerators = await this.prisma.user.createMany({
        data: users,
      });
      return enumerators;
    } catch (error) {
      // Handle any errors here
      console.error('Error:', error);
      throw error; // You might want to throw the error or handle it differently.
    }
  }
}
