import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterBodyDto {
    @IsNotEmpty({ message: 'Имя не должно быть пустым' })
    @IsString()
    public readonly name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'Некорректный email' })
    public readonly email: string;

    @IsNotEmpty()
    public readonly password: string;
}
