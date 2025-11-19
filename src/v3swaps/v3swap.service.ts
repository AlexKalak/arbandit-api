import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { V3Swap, V3SwapWhere } from './v3swap.model';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';

type V3SwapServiceFindProps = {
  first: number;
  skip: number;
  fromHead: boolean;
  where?: V3SwapWhere;
};

@Injectable()
export class V3SwapService {
  constructor(
    @Inject('V3_SWAP_REPOSITORY')
    private v3SwapRepository: Repository<V3Swap>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async find({
    first,
    skip,
    fromHead,
    where,
  }: V3SwapServiceFindProps): Promise<V3Swap[]> {
    if (!where) {
      return this.v3SwapRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder = this.v3SwapRepository
      .createQueryBuilder('swap')
      .leftJoinAndSelect('swap.pool', 'pool');

    const metadata = this.v3SwapRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const swaps = queryBuilder
      .orderBy('swap.id', fromHead ? 'DESC' : 'ASC')
      .take(first)
      .skip(skip)
      .getMany();

    return swaps;
  }

  async findByID(id: number): Promise<V3Swap | null> {
    return this.v3SwapRepository.findOneBy({ id: id });
  }
}
