import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { V3Pool, V3PoolWhere } from './v3pool.model';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';

@Injectable()
export class V3PoolService {
  constructor(
    @Inject('V3_POOL_REPOSITORY')
    private v3PoolRepository: Repository<V3Pool>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async findAll(
    first: number,
    skip: number,
    where?: V3PoolWhere,
  ): Promise<V3Pool[]> {
    if (!where) {
      return this.v3PoolRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder = this.v3PoolRepository
      .createQueryBuilder('pool')
      .leftJoinAndSelect('pool.token0', 'token0')
      .leftJoinAndSelect('pool.token1', 'token1');

    if (where.token0Symbol) {
      queryBuilder.andWhere(`token0.symbol = :symbol0`, {
        symbol0: where.token0Symbol,
      });
    }
    if (where.token1Symbol) {
      queryBuilder.andWhere(`token1.symbol = :symbol1`, {
        symbol1: where.token1Symbol,
      });
    }

    const metadata = this.v3PoolRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const pools = queryBuilder.take(first).skip(skip).getMany();

    return pools;
  }

  async findByAddress(address: string): Promise<V3Pool | null> {
    return this.v3PoolRepository.findOneBy({ address: address });
  }
}
