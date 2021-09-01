import {
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Pack, PackDocument } from './schema/pack.schema';
import { CreatePackDto } from './dto/create-pack.dto';
import { FileService, FileType } from 'src/file/file.service';

@Injectable()
export class PackService {
    constructor(
        @InjectModel(Pack.name) private packModel: Model<PackDocument>,
        private fileService: FileService,
    ) {}

    async create(dto: CreatePackDto, picture, audio) {
        const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
        const picturePath = this.fileService.createFile(
            FileType.IMAGE,
            picture,
        );  
        
        const track = await this.packModel.create({
            ...dto,
            listens: 0,
            audio: audioPath,
            picture: picturePath,
        });
        
        return track;
    }
}
