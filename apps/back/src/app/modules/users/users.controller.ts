import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto/user.dto';
import { AuthGuard } from '../auth/auth.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly _usersService: UsersService) {}

    // @Post('create')
    // public create(@Body() createUserDto: UserDto) {
    //     return this._usersService.createUser(createUserDto);
    // }

    @Get('findAll')
    public findAll() {
        return this._usersService.findUserAll();
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    public async getProfile(
        @Request() req: { user: UserDto },
    ): Promise<UserDto> {
        const user = await this._usersService.getUserById(req.user.id);

        return new UserDto(user);
    }
}
