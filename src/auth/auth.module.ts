import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/users/users.module';

@Module({
  imports: [
    JwtModule.register({
      secret: 'your-secret-key', // move to .env
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
