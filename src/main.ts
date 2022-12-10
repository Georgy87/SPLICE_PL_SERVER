import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const start = async () => {
    try {
        const PORT = process.env.PORT || 8000;
        const app = await NestFactory.create(AppModule);
        //test test test
        app.enableCors();
        await app.listen(PORT, () => {
            console.log(`server started on PORT ${PORT}`);
        });
    } catch (error) {
        console.log(error);
    }
};
start();
