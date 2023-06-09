import { Injectable } from '@nestjs/common';
import {
  InputBanUserForBlogDTO,
  QueryBannedUsersForBlogDTO,
} from './applications/blogger-users.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BanUserForBlog } from './applications/banned-users-for-blogs.entity';

@Injectable()
export class BloggerUsersRepository {
  constructor(
    @InjectRepository(BanUserForBlog)
    private readonly dbBanUserBlogRepository: Repository<BanUserForBlog>,
  ) {}

  async updateBannedUserStatusForBlog(
    userId: string,
    inputData: InputBanUserForBlogDTO,
  ): Promise<boolean> {
    const result = await this.dbBanUserBlogRepository.update(
      { userId: userId, blogId: inputData.blogId },
      {
        isBanned: inputData.isBanned,
        banReason: inputData.isBanned ? inputData.banReason : null,
        banDate: inputData.isBanned ? new Date().toISOString() : null,
      },
    );
    return result.affected === 1;
  }

  async createBannedUserStatusForBlog(newBannedUserStatus: BanUserForBlog) {
    try {
      await this.dbBanUserBlogRepository.insert(newBannedUserStatus);
      return newBannedUserStatus;
    } catch (e) {
      console.log(e.message);
      console.log('catch in the createBannedUserStatusForBlog');
    }
  }

  async totalCountBannedUsersForBlog(
    filter: any,
    queryData: QueryBannedUsersForBlogDTO,
  ) {
    try {
      const queryBuilder = await this.dbBanUserBlogRepository
        .createQueryBuilder('bub')
        .where({ blogId: filter.blogId, isBanned: true });
      if (queryData.searchLoginTerm) {
        queryBuilder.where(
          "bub.blogId = :blogId AND isBanned = :banned AND userLogin ILIKE '%' || :loginTerm || '%'",
          {
            banned: true,
            loginTerm: queryData.searchLoginTerm,
            blogId: filter.blogId,
          },
        );
      }
      return queryBuilder.getCount();
    } catch (e) {
      console.log(e.message);
      console.log('catch in the total count banned users for blog');
    }
  }

  async checkUserForBan(
    userId: string,
    blogId: string,
  ): Promise<BanUserForBlog> {
    return this.dbBanUserBlogRepository.findOne({
      where: { userId: userId, blogId: blogId },
    });
  }

  async findAllBannedUsersForBlog(
    filter: any,
    queryData: QueryBannedUsersForBlogDTO,
  ) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    if (queryData.sortBy === 'login') {
      sortBy = 'userLogin';
    }
    const direction = queryData.sortDirection.toUpperCase();
    try {
      const queryBuilder = await this.dbBanUserBlogRepository
        .createQueryBuilder('bub')
        .where({ blogId: filter.blogId, isBanned: true });
      if (queryData.searchLoginTerm) {
        queryBuilder.where(
          "bub.blog = :blogId AND isBanned = :banned AND userLogin ILIKE '%' || :loginTerm || '%'",
          {
            banned: true,
            loginTerm: queryData.searchLoginTerm,
            blogId: filter.blogId,
          },
        );
      }
      queryBuilder
        .orderBy(`bub.${sortBy}`, (direction as 'ASC') || 'DESC')
        .limit(queryData.pageSize)
        .offset((queryData.pageNumber - 1) * queryData.pageSize);
      return queryBuilder.getMany();
    } catch (e) {
      console.log(e.message);
      console.log('catch in the find all banned users for blog');
    }
  }
}
