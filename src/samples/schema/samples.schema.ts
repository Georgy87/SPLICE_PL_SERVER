import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type SamplesDocument = Samples & Document;

@Schema({ toJSON: { virtuals: true } })
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
	duration: string;

	@Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }])
	likes: mongoose.Schema.Types.ObjectId[];

	@Prop()
	canvasImage: string;

	@Prop()
	bpm: number;

	@Prop()
	category: string;

	@Prop()
	packPicture: string;
}

export const SamplesSchema = SchemaFactory.createForClass(Samples);

// SamplesSchema.virtual('audioCoordinatesParse').get(function () {
// 	if (this.audioCoordinates) {
// 		return JSON.parse(this.audioCoordinates);
// 	}
// });
