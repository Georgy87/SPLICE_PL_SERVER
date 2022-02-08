import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
    @Prop({ unique: true })
    email: string;

    @Prop()
    password: string;

    @Prop()
    fullname: string;

    @Prop()
    confirm_hash: string;

    @Prop()
    avatar: string;
}

export const UserSchema = SchemaFactory.createForClass(User);