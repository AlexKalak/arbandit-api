import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Column, Entity, Index } from 'typeorm';

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
  @Column('numeric', { name: 'defi_scaled_usd_price' })
  defiScaledUsdPrice: string;
}
