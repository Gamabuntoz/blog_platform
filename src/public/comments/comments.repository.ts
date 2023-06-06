import { Injectable } from '@nestjs/common';
import { Comments } from './applications/comments.entity';
import { QueryPostsDTO } from '../posts/applications/posts.dto';
import { InputCommentDTO } from './applications/comments.dto';
import { CommentLikes } from './applications/comments-likes.entity';
import { QueryCommentsDTO } from '../../blogger/blogger_blogs/applications/blogger-blogs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectRepository(Comments)
    private readonly dbCommentsRepository: Repository<Comments>,
    @InjectRepository(CommentLikes)
    private readonly dbCommentLikesRepository: Repository<CommentLikes>,
  ) {}

  async findCommentById(id: string) {
    return this.dbCommentsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async createComment(newComment: Comments) {
    await this.dbCommentsRepository.insert(newComment);
    return newComment;
  }

  async updateCommentLike(
    commentId: string,
    likeStatus: string,
    userId: string,
  ): Promise<boolean> {
    const queryBuilder = await this.dbCommentLikesRepository
      .createQueryBuilder('cl')
      .update({ status: likeStatus })
      .where({ commentId: commentId, userId: userId });
    const result = await queryBuilder.execute();
    return result.affected === 1;
  }

  async setCommentLike(newCommentLike: CommentLikes) {
    await this.dbCommentLikesRepository.insert(newCommentLike);
    await this.changeCountCommentLike(newCommentLike.comment.id);
    return newCommentLike;
  }

  async countLikeCommentStatusInfo(commentId: string, status: string) {
    const queryBuilder = await this.dbCommentLikesRepository
      .createQueryBuilder('cl')
      .where({ commentId: commentId, status: status });
    return queryBuilder.getCount();
  }

  async changeCountCommentLike(commentId: string): Promise<boolean> {
    const likeCount = await this.countLikeCommentStatusInfo(commentId, 'Like');
    const dislikeCount = await this.countLikeCommentStatusInfo(
      commentId,
      'Dislike',
    );
    const result = await this.dbCommentsRepository.update(
      { id: commentId },
      { likeCount, dislikeCount },
    );
    return result.affected === 1;
  }

  async updateComment(
    id: string,
    inputData: InputCommentDTO,
  ): Promise<boolean> {
    const result = await this.dbCommentsRepository.update(
      { id },
      {
        content: inputData.content,
      },
    );
    return result.affected === 1;
  }

  async deleteComment(id: string): Promise<boolean> {
    const result = await this.dbCommentsRepository.delete({ id: id });
    return result.affected === 1;
  }

  async findAllCommentsByPostId(id: string, queryData: QueryPostsDTO) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    const direction = queryData.sortDirection.toUpperCase();
    const queryBuilder = await this.dbCommentsRepository
      .createQueryBuilder('c')
      .where({ postId: id })
      .orderBy(`c.${sortBy}`, (direction as 'ASC') || 'DESC')
      .limit(queryData.pageSize)
      .offset((queryData.pageNumber - 1) * queryData.pageSize);
    return queryBuilder.getMany();
  }

  async findAllCommentsForAllBloggerBlogsAllPosts(
    ownerId: string,
    queryData: QueryCommentsDTO,
  ) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    const direction = queryData.sortDirection.toUpperCase();
    const queryBuilder = await this.dbCommentsRepository
      .createQueryBuilder('c')
      .where(
        `c.postId IN (
                SELECT "id" FROM "posts" 
                WHERE "blogId" IN (
                    SELECT "id"     
                    FROM "blogs" 
                    WHERE "userId" = :ownerId))`,
        { ownerId },
      )
      .orderBy(`c.${sortBy}`, (direction as 'ASC') || 'DESC')
      .limit(queryData.pageSize)
      .offset((queryData.pageNumber - 1) * queryData.pageSize);
    return queryBuilder.getMany();
  }

  async findCommentLikeByCommentAndUserId(commentId: string, userId: string) {
    const queryBuilder = await this.dbCommentLikesRepository
      .createQueryBuilder('cl')
      .where({ commentId: commentId, userId: userId });
    return queryBuilder.getOne();
  }

  async totalCountComments(id: string) {
    const queryBuilder = await this.dbCommentsRepository
      .createQueryBuilder('c')
      .where({ postId: id });
    return queryBuilder.getCount();
  }

  async totalCountCommentsForAllBloggerBlogsAllPosts(ownerId: string) {
    const queryBuilder = await this.dbCommentsRepository
      .createQueryBuilder('c')
      .where(
        `c.postId IN (
                SELECT "id" FROM "posts" 
                WHERE "blogId" IN (
                    SELECT "id"
                    FROM "blogs" 
                    WHERE "userId" = :ownerId))`,
        { ownerId },
      );
    return queryBuilder.getCount();
  }
}
