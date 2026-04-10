import { IsString } from 'class-validator';

export class RefreshTokenDto {
    @IsString() public token: string;
}
