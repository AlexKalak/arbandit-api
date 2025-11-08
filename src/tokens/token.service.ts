import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token, TokenWhere } from './token.model';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private tokenRepository: Repository<Token>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async findAll(
    first: number,
    skip: number,
    where?: TokenWhere,
  ): Promise<Token[]> {
    if (!where) {
      return this.tokenRepository.find({
        skip: skip,
        take: first,
      });
    }

    const queryBuilder = this.tokenRepository.createQueryBuilder('token');

    const metadata = this.tokenRepository.metadata;

    this.gqlWhereParsingService.parse(queryBuilder, where, metadata);

    const tokens = queryBuilder.take(first).skip(skip).getMany();

    return tokens;
  }

  async findByAddress(address: string): Promise<Token | null> {
    return this.tokenRepository.findOneBy({ address: address });
  }
}
