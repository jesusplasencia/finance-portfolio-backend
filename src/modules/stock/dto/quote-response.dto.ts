// src/modules/stock/dto/quote-response.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class QuoteResponse {
  @ApiProperty({ description: 'Current price' })
  @IsNumber()
  c: number;

  @ApiProperty({ description: 'High price of the day' })
  @IsNumber()
  h: number;

  @ApiProperty({ description: 'Low price of the day' })
  @IsNumber()
  l: number;

  @ApiProperty({ description: 'Open price of the day' })
  @IsNumber()
  o: number;

  @ApiProperty({ description: 'Previous close price' })
  @IsNumber()
  pc: number;

  @ApiProperty({ description: 'Unix timestamp of the quote' })
  @IsNumber()
  t: number;
}