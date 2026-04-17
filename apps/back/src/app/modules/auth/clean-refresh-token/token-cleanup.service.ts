import {InjectRepository} from "@nestjs/typeorm";
import {RefreshTokenEntity} from "../entities/refresh-token.entity";
import {LessThan, Repository} from "typeorm";
import {Cron, CronExpression} from "@nestjs/schedule";
import {Injectable, Logger} from "@nestjs/common";

@Injectable()
export class TokenCleanupService {
    private readonly logger = new Logger(TokenCleanupService.name);

    constructor(
        @InjectRepository(RefreshTokenEntity) private refreshTokenRepo: Repository<RefreshTokenEntity>,
    ) {
    }

    @Cron(CronExpression.EVERY_5_MINUTES)
    public async cleanupOldTokens() {
        this.logger.log('Starting cleanup of old refresh tokens');

        const date = new Date();

        date.setDate(date.getDate() - 1);

        const result = await this.refreshTokenRepo.delete({
            createdAt: LessThan(date),
            isActive: false,
        });

        this.logger.log(`Removed ${result.affected} old inactive tokens`);
    }
}
