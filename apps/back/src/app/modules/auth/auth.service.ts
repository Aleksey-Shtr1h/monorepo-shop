import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { LoginBodyDto } from './dto/login-body.dto';
import * as bycrypt from 'bcrypt';
import { LoginResponseDto } from './dto/login-response.dto';

import { JwtService } from '@nestjs/jwt';
import { RegisterBodyDto } from './dto/register-body.dto';
import { UserEntity } from '../users/entities/user.entity';
import { MoreThan, Repository } from 'typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(RefreshTokenEntity)
        private readonly _refreshTokenRepo: Repository<RefreshTokenEntity>,
        private readonly _usersService: UsersService,
        private readonly _jwtService: JwtService,
    ) {}

    public async signIn(signInData: LoginBodyDto): Promise<LoginResponseDto> {
        const foundUser = await this._usersService.getUserByEmail(
            signInData.email,
        );

        if (!foundUser) {
            throw new UnauthorizedException('Invalid email');
        }

        const isPasswordValid = await bycrypt.compare(
            signInData.password,
            foundUser.password,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid password');
        }

        return this.getUserTokens(foundUser);
    }

    public async signUp(
        signUpData: RegisterBodyDto,
    ): Promise<LoginResponseDto> {
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            signUpData.email,
        );

        if (!isEmailValid) {
            throw new BadRequestException('Invalid email');
        }

        const foundUser = await this._usersService.getUserByEmail(
            signUpData.email,
        );

        if (foundUser) {
            throw new BadRequestException('User is exist');
        }

        const hashPassword = await bycrypt.hash(signUpData.password, 10);
        const userCreatedParams = {
            name: signUpData.name,
            email: signUpData.email,
            password: hashPassword,
        };
        const userCreated =
            await this._usersService.createUser(userCreatedParams);

        return this.getUserTokens(userCreated);
    }

    public async getUserTokens(user: UserEntity): Promise<LoginResponseDto> {
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
        };

        const accessToken = await this._jwtService.signAsync(payload);
        const newRefreshToken = new RefreshTokenEntity();
        const expires = new Date();

        expires.setDate(expires.getDate() + 7);
        newRefreshToken.token = this._generateSecureToken();
        newRefreshToken.expires = expires;
        newRefreshToken.user = user;

        const preparedRefreshToken = await newRefreshToken.save();

        return new LoginResponseDto(accessToken, preparedRefreshToken?.token);
    }

    public async refreshToken(token: string): Promise<LoginResponseDto> {
        const refreshToken = await this._refreshTokenRepo.findOne({
            relations: ['user'],
            where: {
                token: token,
                expires: MoreThan(new Date()),
            },
        });

        if (!refreshToken) {
            throw new UnauthorizedException('Refresh token not found');
        }

        return this.getUserTokens(refreshToken.user);
    }

    private _generateSecureToken(): string {
        return randomBytes(48).toString('base64url');
    }
}
