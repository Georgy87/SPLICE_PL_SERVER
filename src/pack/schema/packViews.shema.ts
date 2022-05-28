import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
class Coords {
    @Prop()
    x: number;
    @Prop()
    y: number;
}

@Schema()
export class ChartData {
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

