import {
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
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
        @InjectRepository(RefreshTokenEntity) private _refreshTokenRepo: Repository<RefreshTokenEntity>,
        @InjectRepository(UsersEntity) private _usersRepo: Repository<UsersEntity>,
        private _usersService: UsersService,
        private _jwtService: JwtService,
    ) {}

    public async register(userDto: UserDto, res: Response): Promise<any> {
        const { name, email, password } = userDto;

        const foundUser = await this._usersRepo.findOne({ where: { email } });

        if (foundUser) {
            throw new UnauthorizedException('Email is exist');
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = this._usersRepo.create({
            name,
            email,
            password: hash,
        });

        const createdUser = await this._usersRepo.save(newUser);

        return res.send({
            message: 'Registration successful',
            user: { id: createdUser.id },
        });
    }

    public async login(req: Request, res: Response): Promise<any> {
        const user = req.user as UsersEntity;
        const deviceInfo = req.headers['user-agent'];
        const ipAddress = req.ip;

        const tokens = await this._generateTokens(user, deviceInfo, ipAddress);

        this._setRefreshTokenCookie(res, tokens.refreshToken);
        this._setAccessTokenCookie(res, tokens.accessToken);
        
        res.send({
            message: 'Login successful',
            user: {
                id: user.id,
                role: user.role,
            },
        });
    }

    public async logout(refreshToken: string, res: Response) {
        const activatedRefreshTokens = await this._refreshTokenRepo
            .find({
                where: {isActive: true},
            });

        for (const activatedRefreshToken of activatedRefreshTokens) {
            const isCompare = await bcrypt.compare(refreshToken, activatedRefreshToken.tokenHash);

            if (isCompare) {
                await this._refreshTokenRepo.update(
                    activatedRefreshToken.id,
                    { isActive: false }
                );

                break;
            }
        }

        res.clearCookie('access_token', { httpOnly: true, sameSite: 'strict', path: '/' });
        res.clearCookie('refresh_token', { httpOnly: true, sameSite: 'strict', path: '/' });

        return res.send({ message: 'Logged out' });
    }

    public async refreshTokens(req: Request, res: Response): Promise<any> {
        const oldRefreshToken = req.cookies['refresh_token'];

        if (!oldRefreshToken) {
            throw new UnauthorizedException()
        }

        const deviceInfo = req.headers['user-agent'];
        const ipAddress = req.ip;
        const tokens = await this._refreshTokens(oldRefreshToken, deviceInfo, ipAddress);

        this._setRefreshTokenCookie(res, tokens.refreshToken);
        this._setAccessTokenCookie(res, tokens.accessToken);

        res.send({ message: 'Tokens refreshed' });
    }

    public async validateUser(email: string, password: string): Promise<UsersEntity> {
        const user = await this._usersService.getUserByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Incorrect credentials');
        }

        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            throw new UnauthorizedException('Incorrect credentials');
        }

        return user;
    }

    private async _generateTokens(user: UsersEntity, deviceInfo?: string, ipAddress?: string) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = this._jwtService.sign(payload);
        const refreshToken = this._jwtService.sign(payload, {
            secret: jwtConstants.refresh.secret,
            expiresIn: '7d',
        });

        const tokenHash = await bcrypt.hash(refreshToken, 10);
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

    private _setAccessTokenCookie(res: Response, token: string) {
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 15 * 60 * 1000, // 15 минут (15 - мин, 60 - кол.сек в мин, 1000 - кол.мил.сек в сек)
            path: '/',
        });
    }

    private _setRefreshTokenCookie(res: Response, token: string) {
        res.cookie('refresh_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
            path: '/',
        });
    }

    private async _refreshTokens(oldRefreshToken: string, deviceInfo?: string, ipAddress?: string) {
        // 1. Верификация refresh-токена
        let payload;

        try {
            payload = this._jwtService.verify(
                oldRefreshToken,
                {
                    secret: jwtConstants.refresh.secret
                },
            );
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }

        const user = await this._usersRepo.findOne(
            { where: { id: payload.sub } },
        );

        if (!user) {
            throw new UnauthorizedException()
        }

        // 2. Поиск активного refresh-токена с таким хэшем
        const activatedRefreshTokens = await this._refreshTokenRepo.find({
            where: { userId: user.id, isActive: true },
        });

        let existingToken: RefreshTokenEntity | null = null;

        for (const activatedRefreshToken of activatedRefreshTokens) {
            if (await bcrypt.compare(oldRefreshToken, activatedRefreshToken.tokenHash)) {
                existingToken = activatedRefreshToken;
                break;
            }
        }

        if (!existingToken) {
            throw new UnauthorizedException()
        }

        // 3. Деактивируем старый токен (токен ротация)
        await this._refreshTokenRepo.update(existingToken.id, { isActive: false });

        // 4. Создаём новую пару токенов
        return this._generateTokens(user, deviceInfo, ipAddress);
    }
}
