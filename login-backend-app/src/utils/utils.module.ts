import { Global, Module } from '@nestjs/common';
import { EncodingService } from './services/encoding.service';

@Global()
@Module({
  imports: [],
  controllers: [],
  providers: [EncodingService],
  exports: [EncodingService]
})
export class UtilModule {}
