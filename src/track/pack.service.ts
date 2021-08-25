import {
    Delete,
    Injectable,
    UploadedFile,
    UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Track, TrackDocument } from './schema/track.schema';
import { CreateTrackDto } from './dto/create-track.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class PackService {
    // constructor(
    //     @InjectModel(Track.name) private trackModel: Model<TrackDocument>,
    //     private fileService: FileService,
    // ) {}

    // async create(dto: CreateTrackDto, picture, audio) {
    //     const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
    //     const picturePath = this.fileService.createFile(
    //         FileType.IMAGE,
    //         picture,
    //     );
    //     const track = await this.trackModel.create({
    //         ...dto,
    //         listens: 0,
    //         audio: audioPath,
    //         picture: picturePath,
    //     });
    //     return track;
    // }
}
