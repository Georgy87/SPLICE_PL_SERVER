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
import { TrackService } from './track.service';

@Controller('/tracks')
export class TrackController {
    constructor(private trackService: TrackService) {}

    @Post()
    @UseInterceptors(
        FileFieldsInterceptor([
            { name: 'picture', maxCount: 1 },
            { name: 'audio', maxCount: 1 },
        ]),
    )
    create(@UploadedFiles() files, @Body() dto: CreateTrackDto) {
        const { picture, audio } = files;

        return this.trackService.create(dto, picture[0], audio[0]);
    }
}
