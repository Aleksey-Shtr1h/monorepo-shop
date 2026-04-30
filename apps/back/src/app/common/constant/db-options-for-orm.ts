import { UsersEntity } from '../../modules/users/entities/usersEntity';
import { RefreshTokenEntity } from '../../modules/auth/entities/refresh-token.entity';
import { UploadFileEntity } from "../../modules/upload-files/entities/upload-file.entity";

export const entitiesForORM = [
    UsersEntity,
    RefreshTokenEntity,
    UploadFileEntity,
];
