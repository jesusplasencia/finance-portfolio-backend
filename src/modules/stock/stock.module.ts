import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { HttpClientModule } from 'src/common/http';
import { DictionaryModule } from '../dictionary';

@Module({
  imports: [HttpClientModule, DictionaryModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
