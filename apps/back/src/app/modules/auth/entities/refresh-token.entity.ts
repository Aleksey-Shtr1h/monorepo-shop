import {
    BaseEntity,
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity {
    @PrimaryColumn()
    public token: string;

    @Column()
    public expires: Date;

    @ManyToOne(() => UserEntity, (entity) => entity.refreshToken)
    @JoinColumn({ name: 'user_id' })
    public user: UserEntity;
}
