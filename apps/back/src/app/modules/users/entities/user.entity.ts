import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { RefreshTokenEntity } from '../../auth/entities/refresh-token.entity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column({ length: 100 })
    public name: string;

    @Column({ unique: true })
    public email: string;

    @Column()
    public password: string;

    @CreateDateColumn()
    public created_date: Date;

    @UpdateDateColumn()
    public updated_date: Date;

    @OneToMany(() => RefreshTokenEntity, (entity) => entity.user)
    public refreshToken: RefreshTokenEntity;
}
