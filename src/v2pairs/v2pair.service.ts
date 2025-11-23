import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';
import { V2Pair, V2PairWhere } from './v2pair.model';

@Injectable()
export class V2PairService {
  constructor(
    @Inject('V2_PAIR_REPOSITORY')
    private v2PairRepository: Repository<V2Pair>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async findAll(
    first: number,
    skip: number,
    where?: V2PairWhere,
  ): Promise<V2Pair[]> {
    if (!where) {
      return this.v2PairRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder = this.v2PairRepository
      .createQueryBuilder('pair')
      .leftJoinAndSelect('pair.token0', 'token0')
      .leftJoinAndSelect('pair.token1', 'token1');

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

    const metadata = this.v2PairRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const pools = queryBuilder.take(first).skip(skip).getMany();

    return pools;
  }

  async findByAddress(
    address: string,
    chainID: number,
  ): Promise<V2Pair | null> {
    return this.v2PairRepository.findOne({
      where: {
        address: address,
        chainId: chainID,
      },
    });
  }
}
