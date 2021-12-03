import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { LocalStrategy } from './strategies/local.strategy';

import { User, UserSchema } from '../users/schema/user.schema';
import { UsersService } from '../users/users.service';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		UsersModule,
		PassportModule,
		JwtModule.register({
			secret: process.env.SECRET_KEY || 'JWT-SECRET-KEY',
			signOptions: { expiresIn: '30d' },
		}),
	],

	controllers: [AuthController ],
	providers: [AuthService, UsersService, LocalStrategy],
})
export class AuthModule {}
