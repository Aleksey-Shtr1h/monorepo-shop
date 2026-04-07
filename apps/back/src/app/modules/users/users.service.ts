import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Users} from "./entities/user.entity";
import {Repository} from "typeorm";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private _usersRepository: Repository<Users>,
  ) {}

  public create(createUserDto: CreateUserDto): Promise<Users> {
    const newUser = this._usersRepository.create(createUserDto);

    return this._usersRepository.save(newUser);
  }

  public findAll(): Promise<Users[]> {
    return this._usersRepository.find();
  }
}
