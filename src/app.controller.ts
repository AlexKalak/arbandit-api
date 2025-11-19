import { Controller, Get } from '@nestjs/common';

import { AppService } from './app.service';
import { V3SwapService } from './v3swaps/v3swap.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly v3SwapService: V3SwapService,
  ) {}

  @Get()
  getHello(): string {
    return 'hello';
  }
}
