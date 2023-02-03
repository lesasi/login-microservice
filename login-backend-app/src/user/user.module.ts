import { Module } from '@nestjs/common';
import { UtilModule } from '../utils/utils.module';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [UtilModule],
  controllers: [],
  providers: [UserRepository, UserService],
  exports: [UserService]
})
export class UserModule {}
