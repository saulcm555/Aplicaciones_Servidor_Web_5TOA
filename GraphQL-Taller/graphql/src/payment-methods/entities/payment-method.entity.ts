import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Order } from '../../orders/entities/order.entity';

@ObjectType()
export class PaymentMethod {
  @Field(() => Int, { description: 'Payment method ID' })
  id_payment_method: number;

  @Field({ description: 'Payment method name' })
  method_name: string;

  @Field({ nullable: true, description: 'Payment details' })
  details_payment?: string;

  @Field(() => [Order], { nullable: true, description: 'Orders using this payment method' })
  orders?: Order[];
}
