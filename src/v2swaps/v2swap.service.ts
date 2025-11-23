import { Injectable, Inject } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';
import { V2Swap, V2SwapWhere } from './v2swap.model';

type V2SwapServiceFindProps = {
  first: number;
  skip: number;
  fromHead: boolean;
  where?: V2SwapWhere;
};
type V2SwapServiceFindByMinimalTimestampProps = {
  minimalTimestamp: number;
  skip: number;
  where?: V2SwapWhere;
};

@Injectable()
export class V2SwapService {
  constructor(
    @Inject('V2_SWAP_REPOSITORY')
    private v2SwapRepository: Repository<V2Swap>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async find({
    first,
    skip,
    fromHead,
    where,
  }: V2SwapServiceFindProps): Promise<V2Swap[]> {
    if (!where) {
      return this.v2SwapRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder = this.v2SwapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pair', 'pair');

    const metadata = this.v2SwapRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const swaps = queryBuilder
      .orderBy('swap.id', fromHead ? 'DESC' : 'ASC')
      .take(first)
      .skip(skip)
      .getMany();

    return swaps;
  }

  async findByMinimalTimestamp({
    minimalTimestamp,
    skip,
    where,
  }: V2SwapServiceFindByMinimalTimestampProps): Promise<V2Swap[]> {
    if (!where) {
      return this.v2SwapRepository.find({
        skip: skip,
        where: {
          txTimestamp: MoreThan(minimalTimestamp),
        },
      });
    }

    const queryBuilder = this.v2SwapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pool', 'pool');

    const metadata = this.v2SwapRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const swaps = queryBuilder
      .andWhere('swap.tx_timestamp > :minTimestamp', {
        minTimestamp: minimalTimestamp,
      })
      .orderBy('swap.id', 'DESC')
      .skip(skip)
      .getMany();

    return swaps;
  }

  async findByID(id: number): Promise<V2Swap | null> {
    return this.v2SwapRepository.findOneBy({ id: id });
  }
}
