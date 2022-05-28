import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

import { ChartData } from './packViews.shema';

export type PackDocument = Pack & Document;

@Schema({
	timestamps: true,
	toJSON: { virtuals: true },
})
export class Pack {
	@Prop()
	genre: string;

	@Prop()
	name: string;

	@Prop()
	packInfo: string;

	@Prop()
	listens: number;

	@Prop()
	picture: string;

	@Prop()
	audio: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	userId: mongoose.Schema.Types.ObjectId;

	@Prop()
	update: boolean;

	@Prop()
	viewsData: ChartData;
}

export const PackSchema = SchemaFactory.createForClass(Pack);

PackSchema.virtual('samples', {
	ref: 'Samples',
	localField: '_id',
	foreignField: 'packId',
});

