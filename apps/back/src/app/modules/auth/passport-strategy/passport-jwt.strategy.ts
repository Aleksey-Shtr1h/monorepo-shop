import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
// eslint-disable-next-line @nx/enforce-module-boundaries
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
        console.log(payload);

        return { userId: payload.sub, username: payload.username };
    }
}
