import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';
import { MongooseModule } from '@nestjs/mongoose';

import { FileModule } from './file/file.module';
import { PackModule } from './pack/pack.module';
import { SamplesModule } from './samples/samples.module';

@Module({
    imports: [

    ServeStaticModule.forRoot({
            rootPath: path.resolve(__dirname, 'static'),
        }),
        MongooseModule.forRoot(
            'mongodb+srv://admin:1987toyuiui@cluster0.erfjs.mongodb.net/SPLICE?retryWrites=true&w=majority',
        ),
        PackModule,
        FileModule,
        SamplesModule,
    ],
})
export class AppModule {};
