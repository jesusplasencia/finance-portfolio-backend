import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockService } from './stock.service';
import { HistoryQueryDto } from './dto/history-query.dto';

@Controller('stocks')
export class StockController {
  constructor(private readonly stockService: StockService) {}

  @Get(':symbol/quote')
  getQuote(@Param('symbol') symbol: string) {
    return this.stockService.fetchQuote(symbol);
  }

  @Get(':symbol/history')
  getHistory(
    @Param('symbol') symbol: string,
    @Query() query: HistoryQueryDto,
  ) {
    return this.stockService.fetchHistory(symbol, query.from, query.to);
  }
}
