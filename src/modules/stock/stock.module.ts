import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { HttpClientModule } from 'src/common/http';

@Module({
  imports: [HttpClientModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
