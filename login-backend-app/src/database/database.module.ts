import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongoClient } from 'mongodb';
import { MONGO_CONNECTION } from './utils';

const connection = {
  provide: MONGO_CONNECTION,
  useFactory: async (configService: ConfigService) => {
    try {
      const mongoConnectionUrl = configService.get('mongoConnectionString');
      console.log('Mongo connection ', mongoConnectionUrl)
      return await MongoClient.connect(mongoConnectionUrl, { maxPoolSize: 2 });
    } catch (error) {
      console.error(error);
    }
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [connection],
  exports: [connection]
})
export class DatabaseModule {}
