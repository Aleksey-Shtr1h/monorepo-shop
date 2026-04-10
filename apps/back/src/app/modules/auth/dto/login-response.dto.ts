import { IsNotEmpty } from 'class-validator';

export class LoginResponseDto {
    @IsNotEmpty()
    public readonly accessToken: string;

    @IsNotEmpty()
    public readonly refreshToken: string;

    constructor(accessToken: string, refreshToken: string) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
