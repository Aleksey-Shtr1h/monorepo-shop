import { Controller } from '@nestjs/common';

@Controller('users')
export class UsersController {
    // constructor(private readonly _usersService: UsersService) {}
    //
    // @Get('findAll')
    // public findAll() {
    //     return this._usersService.findUserAll();
    // }
    //
    // @UseGuards(AuthGuard)
    // @Get('profile')
    // public async getProfile(
    //     @Request() req: { user: UserDto },
    // ): Promise<UserDto> {
    //     const user = await this._usersService.getUserById(req.user.id);
    //
    //     return new UserDto(user);
    // }
}
