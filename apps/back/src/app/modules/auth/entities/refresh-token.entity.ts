import {
    BaseEntity,
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UsersEntity } from '../../users/entities/usersEntity';

@Entity('refresh_token')
export class RefreshTokenEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    public id: string;

    @Column()
    @Index()
    public tokenHash: string; // хэш refresh-токена для быстрого поиска

    @Column({ nullable: true })
    public deviceInfo: string; // User-Agent

    @Column({ nullable: true })
    public ipAddress: string; // IP при создании сессии

    @Column({ type: 'timestamp' })
    public expiresAt: Date; // срок действия токена

    @Column({ default: true })
    public isActive: boolean; // позволяет отзывать сессию

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    public createdAt: Date;

    @ManyToOne(() => UsersEntity, (user) => user.refreshTokens, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'userId' })
    public user: UsersEntity;

    @Column()
    @Index()
    public userId: string;
}
