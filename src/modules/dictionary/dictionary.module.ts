// src/modules/stock/dictionary.module.ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpClientModule } from 'src/common/http';
import { DictionaryService } from './dictionary.service';

@Module({
  imports: [
    HttpClientModule,
    ScheduleModule.forRoot(), // enables @Cron
  ],
  providers: [DictionaryService],
  exports: [DictionaryService],
})
export class DictionaryModule {}
