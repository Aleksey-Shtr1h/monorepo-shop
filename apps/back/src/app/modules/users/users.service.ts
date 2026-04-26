import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './entities/usersEntity';
import { Repository } from 'typeorm';
import { RegisterBodyDto } from '../auth/dto/register-body.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private _usersRepository: Repository<UsersEntity>,
    ) {}

    public findUserAll(): Promise<UsersEntity[]> {
        return this._usersRepository.find();
    }

    public getUserById(id: string): Promise<UsersEntity> {
        return this._usersRepository.findOne({
            where: {
                id: id,
            },
        });
    }

    public getUserByEmail(email: string): Promise<UsersEntity> {
        return this._usersRepository.findOne({
            where: {
                email: email,
            },
        });
    }

    public async createUser(signUpBody: RegisterBodyDto): Promise<UsersEntity> {
        const newUser = new UsersEntity();

        newUser.name = signUpBody.name;
        newUser.email = signUpBody.email.trim().toLowerCase();
        newUser.password = signUpBody.password;

        return await newUser.save();
    }
}
