import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constant/jwt';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { UserEntity } from '../users/entities/user.entity';

@Module({
    imports: [
        // UsersModule,
        TypeOrmModule.forFeature([UserEntity, RefreshTokenEntity]),
        JwtModule.register({
            global: true,
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '600s' },
        }),
    ],
    providers: [AuthService, UsersService],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
