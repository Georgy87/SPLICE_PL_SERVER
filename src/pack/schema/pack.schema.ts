import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { PackViewsDataType } from './packViews.shema';

export type PackDocument = Pack & Document;

@Schema()
class Coords {
	@Prop()
	x: number;
	@Prop()
	y: number;
}

@Schema()
class ViewsData {
	@Prop()
	January: Coords;
	@Prop()
	February: Coords;
	@Prop()
	March: Coords;
	@Prop()
	April: Coords;
	@Prop()
	May: Coords;
	@Prop()
	June: Coords;
	@Prop()
	July: Coords;
	@Prop()
	August: Coords;
	@Prop()
	September: Coords;
	@Prop()
	October: Coords;
	@Prop()
	November: Coords;
	@Prop()
	December: Coords;
}

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
	viewsData: ViewsData;
}

export const PackSchema = SchemaFactory.createForClass(Pack);

PackSchema.virtual('samples', {
	ref: 'Samples',
	localField: '_id',
	foreignField: 'packId',
});

