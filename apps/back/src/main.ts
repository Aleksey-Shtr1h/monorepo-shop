import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    const port = 3000;

    app.use(cookieParser());
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
        credentials: true,
        origin: 'http://localhost:4200',
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
}

bootstrap();
