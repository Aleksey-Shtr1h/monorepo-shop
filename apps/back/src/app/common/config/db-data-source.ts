import { DataSourceOptions } from 'typeorm';
import { entitiesForORM } from '../constant/db-options-for-orm';

export const dbDataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '25041903',
    database: 'shop',
    entities: entitiesForORM,
    synchronize: true,
    logging: true,
};
