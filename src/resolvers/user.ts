import { MyContext } from 'src/types';
import { Arg, Ctx, Field, InputType, Mutation, Resolver } from 'type-graphql';

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@Resolver()
export class UserResolver {
  @Mutation(() => String)
  register(
    @Arg('options') options: UsernamePasswordInput,
    @Ctx() { em }: MyContext
  ): Promise<string> {
    return em.
  }
}
