import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login-body.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterBodyDto } from './dto/register-body.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
    constructor(private _authService: AuthService) {}

    @HttpCode(HttpStatus.OK)
    @Post('login')
    public async signIn(
        @Body() signInData: LoginBodyDto,
    ): Promise<LoginResponseDto> {
        return this._authService.signIn(signInData);
    }

    @Post('register')
    public async signUp(
        @Body() signUpData: RegisterBodyDto,
    ): Promise<LoginResponseDto> {
        return this._authService.signUp(signUpData);
    }

    @Post('refresh-token')
    public async refreshToken(
        @Body() refreshToken: RefreshTokenDto,
    ): Promise<LoginResponseDto> {
        return this._authService.refreshToken(refreshToken.token);
    }
}
