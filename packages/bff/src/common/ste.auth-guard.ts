import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Scope,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import * as jwksClient from 'jwks-rsa';
import { Reflector } from '@nestjs/core';

@Injectable({ scope: Scope.DEFAULT })
export class SteAuthGuard implements CanActivate {
  private client: jwksClient.JwksClient;
  private getKey: any;

  constructor(private readonly reflector: Reflector) {
    this.client = jwksClient({
      jwksUri: process.env.JWKS_URI,
      requestHeaders: {}, // Optional
      timeout: 30000, // Defaults to 30s
    });

    this.getKey = (header: jwt.JwtHeader, callback: any) => {
      this.client.getSigningKey(header.kid, (err, key: any) => {
        if (err) {
          console.log(`Error fetching signing key: ${err}`);
          callback(err);
        } else {
          const signingKey = key.publicKey || key.rsaPublicKey;
          callback(null, signingKey);
        }
      });
    };
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();

    const bearerToken = request.headers.authorization?.split(' ')[1];

    if (!bearerToken) {
      return false;
    }

    return new Promise<boolean>((resolve) => {
      jwt.verify(bearerToken, this.getKey, (err, decoded) => {
        if (err) {
          console.log('JWT verification error:', err);
          resolve(false);
        } else {
          if (decoded['roles'][0] !== 'department') {
            resolve(false);
          }
          request.headers.userId = decoded.sub;
          request.headers.username = decoded['preferred_username'];
          request.headers.roles = decoded['roles'];
          resolve(true);
        }
      });
    });
  }
}
