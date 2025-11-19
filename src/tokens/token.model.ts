import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@InputType()
export class TokenWhere {
  @Field(() => Int, { nullable: true })
  chainId?: number | null;

  @Field(() => Int, { nullable: true })
  decimals?: number | null;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  symbol?: string | null;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  logoUri?: string | null;

  @Field(() => String, { nullable: true })
  usdPrice?: string;
}

@ObjectType()
@Index('tokens_pkey', ['address'], { unique: true })
@Entity('tokens', { schema: 'public' })
export class Token {
  @Field(() => Int)
  @Column('integer', { name: 'chain_id', nullable: true })
  chainId: number | null;

  @Field(() => Int)
  @Column('integer', { name: 'decimals', nullable: true })
  decimals: number | null;

  @Field(() => String)
  @Column('character varying', { name: 'name', nullable: true })
  name: string | null;

  @Field(() => String)
  @Column('character varying', { name: 'symbol', nullable: true })
  symbol: string | null;

  @Field(() => String)
  @Column('character varying', { primary: true, name: 'address' })
  address: string;

  @Field(() => String)
  @Column('text', { name: 'logo_uri', nullable: true })
  logoUri: string | null;

  @Field(() => String)
  @Column('numeric', { name: 'usd_price' })
  usdPrice: string;

  @Field(() => [TokenImpact], { nullable: true })
  @OneToMany(() => TokenImpact, (tokenImpact) => tokenImpact.token)
  tokenImpacts: Promise<TokenImpact[]>;

  getRealAmountOfToken(amount: number): number {
    if (!this.decimals) {
      return 0;
    }
    return amount / Math.pow(10, this.decimals);
  }
}

@ObjectType()
@Index(
  'token_price_impacts_pkey',
  ['exchangeIdentifier', 'tokenAddress', 'chainId'],
  { unique: true },
)
@Entity('token_price_impacts', { schema: 'public' })
export class TokenImpact {
  @Field(() => Int)
  @PrimaryColumn('integer', { name: 'chain_id' })
  chainId: number | null;

  @Field(() => String)
  @PrimaryColumn('character varying', { name: 'token_address' })
  tokenAddress: string | null;

  @Field(() => String)
  @PrimaryColumn('character varying', { name: 'exchange_identifier' })
  exchangeIdentifier: string | null;

  @Field(() => String)
  @Column('integer', { name: 'impact', nullable: true })
  impact: number | null;

  @Field(() => String)
  @Column('integer', { name: 'usd_price', nullable: true })
  usdPrice: number | null;

  @Field(() => Token, { nullable: true })
  @ManyToOne(() => Token)
  @JoinColumn([{ name: 'token_address', referencedColumnName: "address" }, { name: "chain_id", referencedColumnName: "chainId" }])
  token: Promise<Token>;
}
