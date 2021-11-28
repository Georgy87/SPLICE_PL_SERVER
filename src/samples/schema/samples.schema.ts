import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type SamplesDocument = Samples & Document;

@Schema()
export class Samples {
	@Prop()
	sampleName: string;

	@Prop()
	packId: mongoose.Schema.Types.ObjectId;

	@Prop()
	audio: string;

	@Prop()
	audioCoordinates: number[];

	@Prop()
	duration: number;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	likes: mongoose.Schema.Types.ObjectId[];
}

export const SamplesSchema = SchemaFactory.createForClass(Samples);
