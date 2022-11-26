import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { LoginService } from './services/login.service';

@Module({
  imports: [UserModule],
  controllers: [AuthController],
  providers: [LoginService, AuthService],
})
export class AuthModule {}
