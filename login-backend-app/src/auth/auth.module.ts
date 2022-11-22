import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { LoginService } from './services/login.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [LoginService],
})
export class AuthModule {}
