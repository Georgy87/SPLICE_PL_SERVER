import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';

import { User, UserSchema } from './schema/user.schema';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Samples, SamplesSchema } from 'src/samples/schema/samples.schema';
import { FileService } from 'src/file/file.service';

@Module({
	imports: [],
	controllers: [UsersController],
	providers: [UsersService],
	// exports: [UsersService],
})
export class UsersModule {}
