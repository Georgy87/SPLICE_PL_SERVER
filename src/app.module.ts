import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { FileModule } from './file/file.module';
import { PackModule } from './pack/pack.module';
import { SamplesModule } from './samples/samples.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AudioModule } from './audio/audio.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		// ServeStaticModule.forRoot({
		// 	rootPath: path.resolve(__dirname, 'static'),
		// }),
		MongooseModule.forRoot(process.env.MONGO_DB_CONNECT),
		PackModule,
		FileModule,
		SamplesModule,
		AuthModule,
		UsersModule,
		AudioModule,
	],
})
export class AppModule {}
