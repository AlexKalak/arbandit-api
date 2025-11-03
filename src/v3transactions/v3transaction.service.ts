import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { V3Transaction, V3TransactionWhere } from './v3transaction.model';

@Injectable()
export class V3TransactionService {
  constructor(
    @Inject('V3_TRANSACTION_REPOSITORY')
    private v3TransactionRepository: Repository<V3Transaction>,
  ) {}

  async findAll(
    first: number,
    skip: number,
    where?: V3TransactionWhere,
  ): Promise<V3Transaction[]> {
    console.log(first, skip);
    if (!where) {
      return this.v3TransactionRepository.find({
        skip: skip,
        take: first,
      });
    }
    return this.v3TransactionRepository.find({
      where,
      skip: skip,
      take: first,
    });
  }

  async findByID(id: number): Promise<V3Transaction | null> {
    return this.v3TransactionRepository.findOneBy({ id: id });
  }
}
