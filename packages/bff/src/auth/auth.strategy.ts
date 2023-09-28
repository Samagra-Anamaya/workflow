import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './jwt-payload.interface'; // Create this interface for JWT payload
import { AuthService } from './auth.service'; // Your AuthService or user service

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'your-secret-key', // Change this to your secret key
    });
  }

  async validate(payload: JwtPayload) {
    console.log({ payload });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const user = await this.authService.validateUserById(payload.sub);
    console.log({ user, payload });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
