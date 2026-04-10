import { UserEntity } from '../../modules/users/entities/user.entity';
import { RefreshTokenEntity } from '../../modules/auth/entities/refresh-token.entity';

export const entitiesForORM = [UserEntity, RefreshTokenEntity];
