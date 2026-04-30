import {
    Controller,
    Post,
    UseGuards,
    Req,
    Body,
    Res,
    Get,
} from '@nestjs/common';
import {
    Request,
    Response,
} from 'express';
import { AuthService } from './auth.service';
import { UserDto } from '../users/dto/user.dto';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';
import { UsersService } from '../users/users.service';
import { RolesGuard } from '../../common/guards/user-role.guard'
import { Roles } from '../../common/decorators/user-roles.decorator'

@Controller('auth') export class AuthController {
    constructor(private _authService: AuthService, private _usersService: UsersService) {
    }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    public async login(@Req() req: Request, @Res() res: Response): Promise<void> {
        await this._authService.login(req, res);
    }

    @Post('register')
    public async register(@Body() body: UserDto, @Res() res: Response): Promise<void> {
        await this._authService.register(body, res);
    }

    @Post('refresh')
    public async refresh(@Req() req: Request, @Res() res: Response) {
        await this._authService.refreshTokens(req, res);
    }

    @UseGuards(JwtAuthGuard)
    @Get('profile')
    public async getProfile(@Req() req) {
        const user = await this._usersService.getUserById(req.user.userId);

        return {
            id: user.id,
            role: user.role,
        };
    }
    
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(['admin'])
    @Get('hasAdmin')
    public async hasAdmin() {
        return true;
    }

    @UseGuards(JwtAuthGuard)
    @Post('logout')
    public async logout(@Req() req: Request, @Res() res: Response) {
        const refreshToken = req.cookies['refresh_token'];
        if (refreshToken) {
            await this._authService.logout(refreshToken, res);
        }
    }
}
