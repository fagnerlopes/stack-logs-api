import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ErrosModule } from './erros/erros.module';

@Module({
  imports: [
    ErrosModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
