import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService) as ConfigService<any>;
  const port = configService.get('port');
  await app.listen(port);
  console.log(`App listening on port ${port}`);
}
bootstrap();
