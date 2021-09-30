import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/file/file.service';
import { Pack, PackSchema } from './schema/pack.schema';
import { PackController } from './pack.controller';
import { PackService } from './pack.service';
@Module({
    imports: [MongooseModule.forFeature([{ name: Pack.name, schema: PackSchema }])],
    controllers: [PackController],
    providers: [PackService, FileService],
})

export class PackModule {};
