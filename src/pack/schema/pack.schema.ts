import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type PackDocument = Pack & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true } })
export class Pack {
	@Prop()
	genre: string;

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

	@Prop()
	userId: mongoose.Schema.Types.ObjectId;
}

export const PackSchema = SchemaFactory.createForClass(Pack);

PackSchema.virtual('samples', {
	ref: 'Samples',
	localField: '_id',
	foreignField: 'packId',
});
