import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { V3TransactionService } from './v3transactions/v3transaction.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly v3TransactionService: V3TransactionService,
  ) {}

  @Get()
  getHello(): string {
    return 'hello';
  }
}
