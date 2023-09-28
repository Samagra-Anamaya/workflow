import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log({ context });
    // Add custom logic here if needed before calling super.canActivate()
    return super.canActivate(context);
  }
}
