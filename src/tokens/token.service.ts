import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Token, TokenImpact, TokenWhere } from './token.model';
import { GqlWhereParsingService } from 'src/database/gqlWhereParsing.service';

@Injectable()
export class TokenService {
  constructor(
    @Inject('TOKEN_REPOSITORY')
    private tokenRepository: Repository<Token>,
    @Inject('TOKEN_IMPACT_REPOSITORY')
    private tokenImpactsRepository: Repository<TokenImpact>,
    private gqlWhereParsingService: GqlWhereParsingService,
  ) {}

  async findImpacts(): Promise<TokenImpact[]> {
    return this.tokenImpactsRepository.find();
  }

  async findAll(
    first: number,
    skip: number,
    where?: TokenWhere,
  ): Promise<Token[]> {
    const queryBuilder = this.tokenRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.tokenImpacts', 'token_impacts');

    const metadata = this.tokenRepository.metadata;

    if (where) {
      this.gqlWhereParsingService.parse(queryBuilder, where, metadata);
    }

    const tokens = await queryBuilder.take(first).skip(skip).getMany();
    console.log('LENGTH: ', tokens.length);
    for (const token of tokens) {
      console.log('a: ', token.tokenImpacts);
    }

    return tokens;
  }

  async findAllWithValidImpacts(
    first: number,
    skip: number,
    where?: TokenWhere,
  ): Promise<Token[]> {
    const queryBuilder = this.tokenRepository
      .createQueryBuilder('token')
      .innerJoin('token.tokenImpacts', 'token_impacts');

    const metadata = this.tokenRepository.metadata;

    if (where) {
      this.gqlWhereParsingService.parse(queryBuilder, where, metadata);
    }

    const tokens = await queryBuilder.take(first).skip(skip).getMany();
    console.log('LENGTH: ', tokens.length);
    for (const token of tokens) {
      console.log('a: ', token.tokenImpacts);
    }

    return tokens;
  }

  async findByAddress(address: string): Promise<Token | null> {
    return this.tokenRepository.findOneBy({ address: address });
  }
}
