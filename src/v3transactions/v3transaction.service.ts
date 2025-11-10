import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { V3Transaction, V3TransactionWhere } from './v3transaction.model';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';

type V3TransactionServiceFindProps = {
  first: number;
  skip: number;
  fromHead: boolean;
  where?: V3TransactionWhere;
};

@Injectable()
export class V3TransactionService {
  constructor(
    @Inject('V3_TRANSACTION_REPOSITORY')
    private v3TransactionRepository: Repository<V3Transaction>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async find({
    first,
    skip,
    fromHead,
    where,
  }: V3TransactionServiceFindProps): Promise<V3Transaction[]> {
    if (!where) {
      return this.v3TransactionRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder = this.v3TransactionRepository
      .createQueryBuilder('transaction')
      .leftJoinAndSelect('transaction.pool', 'pool');

    const metadata = this.v3TransactionRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const transactions = queryBuilder
      .orderBy('transaction.id', fromHead ? 'DESC' : 'ASC')
      .take(first)
      .skip(skip)
      .getMany();
    return transactions;
  }

  async findByID(id: number): Promise<V3Transaction | null> {
    return this.v3TransactionRepository.findOneBy({ id: id });
  }
}
