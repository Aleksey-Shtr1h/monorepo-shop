import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import cookieParser from 'cookie-parser';
// import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const globalPrefix = 'api';
    const port = 3000;
    // const uploadsPath = join(process.cwd(), 'apps/back', 'uploads');
    //
    // app.use(uploadsPath, { prefix: '/uploads/' });
    app.use(cookieParser());
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
        origin: 'http://localhost:4200',
        credentials: true,
    });
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    await app.listen(port);
    Logger.log(
        `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
    );
}

bootstrap();
