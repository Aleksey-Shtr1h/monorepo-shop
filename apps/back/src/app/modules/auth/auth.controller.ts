import { Controller, Post, UseGuards, Req, Body, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { RegisterBodyDto } from './dto/register-body.dto';
import { AuthService } from './auth.service';
import { UsersEntity } from '../users/entities/usersEntity';
import { UserDto } from '../users/dto/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private _authService: AuthService) {}

    @UseGuards(AuthGuard('local'))
    @Post('login')
    public async login(@Req() req: Request, @Res() res: Response) {
        await this._authService.login(req, res);
    }

    //
    // @HttpCode(HttpStatus.OK)
    // @Post('login')
    // public async signIn(
    //     @Body() signInData: LoginBodyDto,
    // ): Promise<LoginResponseDto> {
    //     return this._authService.signIn(signInData);
    // }
    //
    @Post('register')
    public async register(@Body() body: UserDto, @Res() res: Response) {
        const user = await this._authService.register(body, res);
    }
    //
    // @Post('refresh-token')
    // public async refreshToken(
    //     @Body() refreshToken: RefreshTokenDto,
    // ): Promise<LoginResponseDto> {
    //     return this._authService.refreshToken(refreshToken.token);
    // }
}
