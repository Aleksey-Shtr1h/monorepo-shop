import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginBodyDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'Некорректный email' })
    public readonly email: string;

    @IsNotEmpty()
    public readonly password: string;
}
