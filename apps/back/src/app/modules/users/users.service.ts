import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterBodyDto } from '../auth/dto/register-body.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity)
        private _usersRepository: Repository<UserEntity>,
    ) {}

    public findUserAll(): Promise<UserEntity[]> {
        return this._usersRepository.find();
    }

    public getUserById(id: string): Promise<UserEntity> {
        return this._usersRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    public getUserByEmail(email: string): Promise<UserEntity> {
        return this._usersRepository.findOne({
            where: {
                email: email,
            },
        });
    }

    public async createUser(signUpBody: RegisterBodyDto): Promise<UserEntity> {
        const newUser = new UserEntity();

        newUser.name = signUpBody.name;
        newUser.email = signUpBody.email.trim().toLowerCase();
        newUser.password = signUpBody.password;

        return await newUser.save();
    }
}
