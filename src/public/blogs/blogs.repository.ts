import { Injectable } from '@nestjs/common';
import { QueryBlogsDTO } from './applications/blogs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blogs } from '../../blogger/blogger_blogs/applications/blogger-blogs.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly dbBlogsRepository: Repository<Blogs>,
  ) {}

  async findAllBlogs(queryData: QueryBlogsDTO) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    const direction = queryData.sortDirection.toUpperCase();
    try {
      const queryBuilder = await this.dbBlogsRepository
        .createQueryBuilder('b')
        .where({ blogIsBanned: false });
      if (queryData.searchNameTerm) {
        queryBuilder.where(
          `"blogIsBanned" = false AND name ILIKE '%' || :nameTerm || '%'`,
          {
            nameTerm: queryData.searchNameTerm,
          },
        );
      }
      queryBuilder
        .orderBy(`b.${sortBy}`, (direction as 'ASC') || 'DESC')
        .limit(queryData.pageSize)
        .offset((queryData.pageNumber - 1) * queryData.pageSize);
      return queryBuilder.getMany();
    } catch (e) {
      console.log(e.message);
      console.log('catch in the total count blogs');
    }
  }

  async totalCountBlogs(queryData: QueryBlogsDTO) {
    try {
      const queryBuilder = await this.dbBlogsRepository
        .createQueryBuilder('b')
        .where({ blogIsBanned: false });
      if (queryData.searchNameTerm) {
        queryBuilder.where(
          `"blogIsBanned" = false AND name ILIKE '%' || :nameTerm || '%'`,
          {
            nameTerm: queryData.searchNameTerm,
          },
        );
      }
      return queryBuilder.getCount();
    } catch (e) {
      console.log(e.message);
      console.log('catch in the total count blogs');
    }
  }

  async findBlogById(id: string) {
    return this.dbBlogsRepository.findOne({ where: { id: id } });
  }
}
