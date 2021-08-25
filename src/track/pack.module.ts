import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FileService } from 'src/file/file.service';
import { Track, TrackSchema } from './schema/track.schema';
import { PackController } from './pack.controller';
import { PackService } from './pack.service';

@Module({
    // imports: [MongooseModule.forFeature([{ name: Track.name, schema: TrackSchema }])],
    controllers: [PackController],
    providers: [PackService, FileService],
})
export class PackModule {}
