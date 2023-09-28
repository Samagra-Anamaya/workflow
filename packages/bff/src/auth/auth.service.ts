import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async generateToken(username: string) {
    const payload = { username };
    return this.jwtService.sign(payload);
  }

  async validateUserById(userId: string) {
    console.log({ userId });
    // Implement user validation logic here (e.g., fetching user from the database)
  }
}
