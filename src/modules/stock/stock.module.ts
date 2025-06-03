import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';
import { SharedHttpModule } from 'src/common/http.module';

@Module({
  imports: [SharedHttpModule],
  controllers: [StockController],
  providers: [StockService],
})
export class StockModule {}
