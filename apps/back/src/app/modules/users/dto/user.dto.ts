import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { UserEntity } from '../entities/user.entity';

export class UserDto {
    @IsString()
    public id?: string;

    @IsNotEmpty({ message: 'Имя не должно быть пустым' })
    @IsString()
    public readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Некорректный email' })
    public readonly email: string;

    @IsNotEmpty()
    @MinLength(8, { message: 'Пароль должен содержать не менее 6 символов' })
    public readonly password: string;

    constructor(userEntity: UserEntity) {
        this.id = userEntity.id;
        this.name = userEntity.name;
        this.email = userEntity.email;
    }
}
