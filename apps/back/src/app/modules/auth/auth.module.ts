import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { UsersEntity } from '../users/entities/usersEntity';
import { LocalStrategy } from './passport-strategy/passport-local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constant/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
    imports: [
        TypeOrmModule.forFeature([UsersEntity, RefreshTokenEntity]),
        PassportModule,
        JwtModule.register({
            secret: jwtConstants.access.secret,
            signOptions: { expiresIn: '60s' },
        }),
    ],
    providers: [AuthService, UsersService, LocalStrategy],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
