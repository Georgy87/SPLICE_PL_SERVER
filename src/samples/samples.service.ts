import {
    Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { FileService, FileType } from 'src/file/file.service';
import { Samples, SamplesDocument } from './schema/samples.schema';

@Injectable()
export class SamplesService {
    constructor(
        @InjectModel(Samples.name) private packModel: Model<SamplesDocument>,
        private fileService: FileService,
    ) {}

    async create(files) {
        
        // const audioPath = this.fileService.createFile(FileType.AUDIO, audio);
        // const picturePath = this.fileService.createFile(
        //     FileType.IMAGE,
        //     picture,
        // );  
      
        // await this.packModel.create({
        //     ...dto,
        //     listens: 0,
        //     audio: audioPath,
        //     picture: picturePath,
        // });
        
        // const packs = await this.packModel.find();
        // return packs;
    }


}
