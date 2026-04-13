import {
    BadRequestException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bycrypt from 'bcrypt';
import { UsersEntity } from '../users/entities/usersEntity';
import { UserDto } from '../users/dto/user.dto';
import { Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../common/constant/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RefreshTokenEntity } from './entities/refresh-token.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
    constructor(
        private _usersService: UsersService,
        private _jwtService: JwtService,
        @InjectRepository(RefreshTokenEntity)
        private _refreshTokenRepo: Repository<RefreshTokenEntity>,
        @InjectRepository(UsersEntity)
        private _usersRepo: Repository<UsersEntity>,
    ) {}

    public async register(userDto: UserDto, res: Response): Promise<any> {
        const { name, email, password } = userDto;

        const exists = await this._usersRepo.findOne({ where: { email } });

        if (exists) {
            throw new UnauthorizedException('Email уже занят');
        }

        const newUser = this._usersRepo.create({
            name,
            email,
            password,
        });

        const createdUser = await this._usersRepo.save(newUser);

        // После регистрации сразу логиним (генерируем токены)
        const tokens = await this._generateTokens(createdUser);

        this._setRefreshTokenCookie(res, tokens.refreshToken);
        this._setAccessTokenCookie(res, tokens.accessToken);

        return res.send({
            message: 'Registration successful',
            user: { id: createdUser.id, email: createdUser.email },
        });
    }

    public async login(req: Request, res: Response) {
        const user = req.user as UsersEntity;
        const deviceInfo = req.headers['user-agent'];
        const ipAddress = req.ip;

        const tokens = await this._generateTokens(user, deviceInfo, ipAddress);

        this._setRefreshTokenCookie(res, tokens.refreshToken);
        this._setAccessTokenCookie(res, tokens.accessToken);

        return res.send({ message: 'Login successful' });
    }

    public async validateUser(
        email: string,
        password: string,
    ): Promise<UsersEntity> {
        const user = await this._usersService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Неверные учетные данные');
        }

        const valid = await bycrypt.compare(password, user.password);

        if (!valid) {
            throw new UnauthorizedException('Неверные учетные данные');
        }

        return user;
    }

    private async _generateTokens(
        user: UsersEntity,
        deviceInfo?: string,
        ipAddress?: string,
    ) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = this._jwtService.sign(payload);
        const refreshToken = this._jwtService.sign(payload, {
            secret: jwtConstants.refresh.secret,
            expiresIn: '7d',
        });

        const tokenHash = await bycrypt.hash(refreshToken, 10);
        const expiresAt = new Date();

        expiresAt.setDate(expiresAt.getDate() + 7); // синхронизируем с expiresIn JWT

        const refreshTokenEntity = this._refreshTokenRepo.create({
            tokenHash,
            deviceInfo: deviceInfo || 'unknown',
            ipAddress: ipAddress || 'unknown',
            expiresAt,
            user,
            userId: user.id,
            isActive: true,
        });

        await this._refreshTokenRepo.save(refreshTokenEntity);

        return { accessToken, refreshToken };
    }

    // Вспомогательные методы
    private _setAccessTokenCookie(res: Response, token: string) {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 15 * 60 * 1000, // 15 минут
            path: '/',
        });
    }

    private _setRefreshTokenCookie(res: Response, token: string) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
            path: '/',
        });
    }

    // constructor(
    //     @InjectRepository(RefreshTokenEntity)
    //     private readonly _refreshTokenRepo: Repository<RefreshTokenEntity>,
    //     private readonly _usersService: UsersService,
    //     private readonly _jwtService: JwtService,
    // ) {}
    //
    // public async signIn(signInData: LoginBodyDto): Promise<LoginResponseDto> {
    //     const foundUser = await this._usersService.getUserByEmail(
    //         signInData.email,
    //     );
    //
    //     if (!foundUser) {
    //         throw new UnauthorizedException('Invalid email');
    //     }
    //
    //     const isPasswordValid = await bycrypt.compare(
    //         signInData.password,
    //         foundUser.password,
    //     );
    //
    //     if (!isPasswordValid) {
    //         throw new UnauthorizedException('Invalid password');
    //     }
    //
    //     return this.getUserTokens(foundUser);
    // }
    //
    // public async signUp(
    //     signUpData: RegisterBodyDto,
    // ): Promise<LoginResponseDto> {
    //     const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    //         signUpData.email,
    //     );
    //
    //     if (!isEmailValid) {
    //         throw new BadRequestException('Invalid email');
    //     }
    //
    //     const foundUser = await this._usersService.getUserByEmail(
    //         signUpData.email,
    //     );
    //
    //     if (foundUser) {
    //         throw new BadRequestException('User is exist');
    //     }
    //
    //     const hashPassword = await bycrypt.hash(signUpData.password, 10);
    //     const userCreatedParams = {
    //         name: signUpData.name,
    //         email: signUpData.email,
    //         password: hashPassword,
    //     };
    //     const userCreated =
    //         await this._usersService.createUser(userCreatedParams);
    //
    //     return this.getUserTokens(userCreated);
    // }
    //
    // public async getUserTokens(user: UserEntity): Promise<LoginResponseDto> {
    //     const payload = {
    //         id: user.id,
    //         name: user.name,
    //         email: user.email,
    //     };
    //
    //     const accessToken = await this._jwtService.signAsync(payload);
    //     const newRefreshToken = new RefreshTokenEntity();
    //     const expires = new Date();
    //
    //     expires.setDate(expires.getDate() + 7);
    //     newRefreshToken.token = this._generateSecureToken();
    //     newRefreshToken.expires = expires;
    //     newRefreshToken.user = user;
    //
    //     const preparedRefreshToken = await newRefreshToken.save();
    //
    //     return new LoginResponseDto(accessToken, preparedRefreshToken?.token);
    // }
    //
    // public async refreshToken(token: string): Promise<LoginResponseDto> {
    //     const refreshToken = await this._refreshTokenRepo.findOne({
    //         relations: ['user'],
    //         where: {
    //             token: token,
    //             expires: MoreThan(new Date()),
    //         },
    //     });
    //
    //     if (!refreshToken) {
    //         throw new UnauthorizedException('Refresh token not found');
    //     }
    //
    //     return this.getUserTokens(refreshToken.user);
    // }
    //
    // private _generateSecureToken(): string {
    //     return randomBytes(48).toString('base64url');
    // }
}
