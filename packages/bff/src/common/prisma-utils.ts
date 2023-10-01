import { Prisma } from '@prisma/client';

export const caseInsensitiveQueryBuilder = (
  param: string,
): Prisma.StringFilter => ({
  contains: param,
  mode: 'insensitive',
});
