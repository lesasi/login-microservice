import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('process.env.FRONTEND_LOGIN_URL ', process.env.FRONTEND_LOGIN_URL)
  app.enableCors({
    origin: [`${process.env.FRONTEND_LOGIN_URL}`, 'https://www.google.com'],
    // credentials: true,
    methods: ['GET', 'POST', 'OPTIONS'],
    optionsSuccessStatus: 200,
    maxAge: 3600,
  });
  const configService = app.get(ConfigService) as ConfigService<any>;
  const port = configService.get('port');
  await app.listen(port);
  console.log(`App listening on port ${port}`);
}
bootstrap();
