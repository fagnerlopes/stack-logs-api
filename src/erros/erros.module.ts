import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { errosProviders } from './erros.providers';
import { ErrosService } from './erros.service';
import { ErrosController } from './erros.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ErrosController],
  providers: [
    ...errosProviders,
    ErrosService,
  ],
  exports: [ErrosService]
})
export class ErrosModule { }