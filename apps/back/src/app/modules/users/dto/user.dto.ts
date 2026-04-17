import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UsersEntity } from '../entities/usersEntity';

export class UserDto {
    @IsNotEmpty({ message: 'Имя не должно быть пустым' })
    @IsString()
    public readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Некорректный email' })
    public readonly email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Пароль должен содержать не менее 6 символов' })
    public readonly password: string;

    // constructor(userEntity: UsersEntity) {
    //     this.name = userEntity.name;
    //     this.email = userEntity.email;
    // }
}
