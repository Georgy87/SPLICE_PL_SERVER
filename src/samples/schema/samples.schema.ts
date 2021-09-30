import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose'

export type SamplesDocument = Samples & Document;

@Schema()
export class Samples {
    @Prop()
    sampleName: string;

    @Prop()
    audio: string;

    @Prop()
    packId: mongoose.Schema.Types.ObjectId;

    @Prop({ default: true})
    pause: boolean;
}

export const SamplesSchema = SchemaFactory.createForClass(Samples);