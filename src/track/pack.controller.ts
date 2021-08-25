import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    UploadedFiles,
    UseInterceptors,
    Query,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { CreateTrackDto } from './dto/create-track.dto';
import { PackService } from './pack.service';

@Controller('/api')
export class PackController {
    constructor(private trackService: PackService) {}
    @Post('pack')
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'picture' },
            { name: 'audio' },
        ]),
    )
    @Post() 
    create(@UploadedFiles() files, @Body() body: any) {
        const { picture, audio } = files;
        console.log(picture[0], audio[0]);
        console.log(body);
        // return this.trackService.create(dto, picture[0], audio[0]);
    }
}
