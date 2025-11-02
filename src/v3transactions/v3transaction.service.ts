import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { V3Transaction } from './v3transaction.model';

@Injectable()
export class V3TransactionService {
  constructor(
    @Inject('V3_TRANSACTION_REPOSITORY')
    private v3TransactionRepository: Repository<V3Transaction>,
  ) {}

  async findAll(): Promise<V3Transaction[]> {
    return this.v3TransactionRepository.find();
  }
}
