import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { V3TransactionService } from './v3transactions/v3transaction.service';
import { V3Transaction } from './v3transactions/v3transaction.model';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly v3TransactionService: V3TransactionService,
  ) {}

  @Get()
  async getHello(): Promise<V3Transaction[]> {
    const res = await this.v3TransactionService.findAll();
    return res;
  }
}
