import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,

  ) {}
  use(req: Request, res: Response, next: NextFunction) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(new HttpException("NO Headers",403))
      }
      const accessToken = authorizationHeader.split(' ')[1];
      if (!accessToken) {
        return next(new HttpException("NO Headers",403));
      }
      const userData = this.authService.validateAccessToken(accessToken);
      if (!userData) {
        return next(new HttpException("Token do not validate",403))
      }

      req.user = userData;

      next();

    } catch (e) {
      return next(new HttpException("bad request",401));
    }
  }
}
