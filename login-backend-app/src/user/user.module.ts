import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';

@Module({
  imports: [],
  controllers: [],
  providers: [UserRepository, UserService],
})
export class UserModule {}
