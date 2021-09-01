import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'

export type PackDocument = Pack & Document;

@Schema()
export class Pack {
    @Prop()
    trackName: string;

    @Prop()
    authorName: string;

    @Prop()
    packInfo: string;

    @Prop()
    listens: number;

    @Prop()
    picture: string;

    @Prop()
    audio: string;
}

export const PackSchema = SchemaFactory.createForClass(Pack);