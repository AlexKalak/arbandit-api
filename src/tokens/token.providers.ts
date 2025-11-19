import { DataSource } from 'typeorm';
import { Token, TokenImpact } from './token.model';

export const tokenProviders = [
  {
    provide: 'TOKEN_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Token),
    inject: ['DATA_SOURCE'],
  },
  {
    provide: 'TOKEN_IMPACT_REPOSITORY',
    useFactory: (dataSource: DataSource) =>
      dataSource.getRepository(TokenImpact),
    inject: ['DATA_SOURCE'],
  },
];
