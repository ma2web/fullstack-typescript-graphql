import { FilterQuery, RequiredEntityData } from '@mikro-orm/core';
import { MyContext } from 'src/types';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Post } from '../entities/Post';

@Resolver()
export class PostResolver {
  @Query(() => [Post])
  posts(@Ctx() { em }: MyContext): Promise<Post[]> {
    return em.find(Post, {});
  }

  @Query(() => Post, { nullable: true })
  post(
    @Arg('id', () => Int) id: number,
    @Ctx() { em }: MyContext
  ): Promise<Post | null> {
    return em.findOne(Post, { id });
  }

  @Mutation(() => Post)
  async createPost(
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = em.create(Post, { title } as RequiredEntityData<Post>);
    await em.persistAndFlush(post);
    return post;
  }

  @Mutation(() => Post)
  async updatePost(
    @Arg('id', { nullable: true }) id: number,
    @Arg('title') title: string,
    @Ctx() { em }: MyContext
  ): Promise<Post> {
    const post = await em.findOne(Post, { id } as FilterQuery<Post>);
    if (!post) {
      throw new Error('Post not found');
    }
    if (typeof title !== 'undefined') {
      post.title = title;
      await em.persistAndFlush(post);
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(
    @Arg('id') id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    await em.nativeDelete(Post, { id });
    return true;
  }
}
