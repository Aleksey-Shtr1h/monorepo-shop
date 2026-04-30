import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from '../../../common/constant/jwt';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (req: Request) => req?.cookies?.access_token,
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.access.secret,
        });
    }

    public async validate(payload: any) {
        return { userId: payload.sub, username: payload.name, role: payload.role };
    }
}
