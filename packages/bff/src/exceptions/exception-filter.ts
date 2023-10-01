import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch(Error)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception.message === 'Record not found') {
      response.status(404).json({
        statusCode: 404,
        message: 'Record not found',
      });
    } else {
      console.log({ exception });
      response.status(500).json({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        statusCode: exception?.status || 500,
        message: exception.message || 'Internal Server Error',
      });
    }
  }
}
