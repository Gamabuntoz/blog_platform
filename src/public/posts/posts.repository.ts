import { Injectable } from '@nestjs/common';
import { Posts } from './applications/posts.entity';
import { InputPostDTO, QueryPostsDTO } from './applications/posts.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikes } from './applications/posts-likes.entity';
import { Blogs } from '../../blogger/blogger_blogs/applications/blogger-blogs.entity';
import { Users } from '../../super_admin/sa_users/applications/users.entity';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly dbPostsRepository: Repository<Posts>,
    @InjectRepository(PostLikes)
    private readonly dbPostLikesRepository: Repository<PostLikes>,
  ) {}

  async findAllPosts(queryData: QueryPostsDTO) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    const direction = queryData.sortDirection.toUpperCase();
    const queryBuilder = await this.dbPostsRepository
      .createQueryBuilder('p')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('b.id')
          .from(Blogs, 'b')
          .where({ blogIsBanned: true })
          .getQuery();
        return 'p.blog NOT IN ' + subQuery;
      })
      .orderBy(`p.${sortBy}`, (direction as 'ASC') || 'DESC')
      .limit(queryData.pageSize)
      .offset((queryData.pageNumber - 1) * queryData.pageSize);
    return queryBuilder.getMany();
  }

  async findAllPostsByBlogId(id: string, queryData: QueryPostsDTO) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    const direction = queryData.sortDirection.toUpperCase();
    const queryBuilder = await this.dbPostsRepository
      .createQueryBuilder('p')
      .where({ blog: id })
      .orderBy(`p.${sortBy}`, (direction as 'ASC') || 'DESC')
      .limit(queryData.pageSize)
      .offset((queryData.pageNumber - 1) * queryData.pageSize);
    return queryBuilder.getMany();
  }

  async totalCountPostsExpectBanned() {
    const queryBuilder = await this.dbPostsRepository
      .createQueryBuilder('p')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('b.id')
          .from(Blogs, 'b')
          .where({ blogIsBanned: true })
          .getQuery();
        return 'p.blog NOT IN ' + subQuery;
      });
    return queryBuilder.getCount();
  }

  async totalCountPostsByBlogId(blogId: string) {
    const queryBuilder = await this.dbPostsRepository
      .createQueryBuilder('p')
      .where({ blog: blogId });
    return queryBuilder.getCount();
  }

  async createPost(newPost: Posts) {
    await this.dbPostsRepository.insert(newPost);
    return newPost;
  }

  async findPostById(id: string) {
    return this.dbPostsRepository.findOne({
      where: { id: id },
      relations: ['blog'],
    });
  }

  async updatePost(id: string, inputPostData: InputPostDTO): Promise<boolean> {
    const result = await this.dbPostsRepository.update(
      { id: id },
      {
        title: inputPostData.title,
        shortDescription: inputPostData.shortDescription,
        content: inputPostData.content,
      },
    );
    return result.affected === 1;
  }

  async deletePost(id: string): Promise<boolean> {
    const result = await this.dbPostsRepository.delete({ id: id });
    return result.affected === 1;
  }

  async countLikePostStatusInfo(postId: string, status: string) {
    const queryBuilder = await this.dbPostLikesRepository
      .createQueryBuilder('pl')
      .where({ post: postId, status: status });
    return queryBuilder.getCount();
  }

  async updatePostLike(
    postId: string,
    likeStatus: string,
    userId: string,
  ): Promise<boolean> {
    const queryBuilder = await this.dbPostLikesRepository
      .createQueryBuilder('pl')
      .update({ status: likeStatus })
      .where({ post: postId, user: userId });
    const result = await queryBuilder.execute();
    return result.affected === 1;
  }

  async setPostLike(newPostLike: PostLikes) {
    await this.dbPostLikesRepository.insert(newPostLike);
    await this.changeCountPostLike(newPostLike.post.id);
    return newPostLike;
  }

  async findLastPostLikes(postId: string) {
    const queryBuilder = await this.dbPostLikesRepository
      .createQueryBuilder('pl')
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select('u.id')
          .from(Users, 'u')
          .where({ userIsBanned: true })
          .getQuery();
        return (
          `pl.post = :postId AND status = 'Like' AND pl.user NOT IN ` + subQuery
        );
      })
      .setParameter('postId', postId)
      .orderBy('pl.addedAt', 'DESC')
      .limit(3);
    return queryBuilder.getMany();
  }

  async findPostLikeByPostAndUserId(postId: string, userId: string) {
    const queryBuilder = await this.dbPostLikesRepository
      .createQueryBuilder('pl')
      .where({ post: postId, user: userId });
    return queryBuilder.getOne();
  }

  async changeCountPostLike(postId: string) {
    const likeCount = await this.countLikePostStatusInfo(postId, 'Like');
    const dislikeCount = await this.countLikePostStatusInfo(postId, 'Dislike');
    const result = await this.dbPostsRepository.update(
      { id: postId },
      {
        likeCount: likeCount,
        dislikeCount: dislikeCount,
      },
    );
    return result.affected === 1;
  }
}
