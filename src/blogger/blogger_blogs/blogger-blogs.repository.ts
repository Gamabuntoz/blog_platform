import { Injectable } from '@nestjs/common';
import { Blogs } from './applications/blogger-blogs.entity';
import { InputBlogDTO, QueryBlogsDTO } from './applications/blogger-blogs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BloggerBlogsRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly dbBlogsRepository: Repository<Blogs>,
  ) {}

  async findAllBlogs(filter: any, queryData: QueryBlogsDTO) {
    let sortBy = 'createdAt';
    if (queryData.sortBy) {
      sortBy = queryData.sortBy;
    }
    const direction = queryData.sortDirection.toUpperCase();
    try {
      const queryBuilder = await this.dbBlogsRepository
        .createQueryBuilder('b')
        .where({ userId: filter.userId });
      if (filter.searchNameTerm) {
        queryBuilder.where(
          "b.userId = :id AND b.name ILIKE '%' || :nameTerm || '%'",
          {
            nameTerm: filter.searchNameTerm,
            id: filter.userId,
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
      console.log('catch in the find all blogs');
    }
  }

  async totalCountBlogs(filter: any) {
    try {
      const queryBuilder = await this.dbBlogsRepository
        .createQueryBuilder('b')
        .where({ userId: filter.userId });
      if (filter.searchNameTerm) {
        queryBuilder.where(
          "b.user = :id AND b.name ILIKE '%' || :nameTerm || '%'",
          {
            nameTerm: filter.searchNameTerm,
            id: filter.userId,
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
    try {
      return this.dbBlogsRepository.findOne({
        where: { id: id },
      });
    } catch (e) {
      console.log(e.message);
      console.log('catch in the findBlogById by blogger');
    }
  }

  async createBlog(newBlog: Blogs) {
    await this.dbBlogsRepository.insert(newBlog);
    return newBlog;
  }

  async updateBlog(id: string, inputBlogData: InputBlogDTO): Promise<boolean> {
    const result = await this.dbBlogsRepository.update(
      { id: id },
      {
        name: inputBlogData.name,
        description: inputBlogData.description,
        websiteUrl: inputBlogData.websiteUrl,
      },
    );
    return result.affected === 1;
  }

  async deleteBlog(id: string): Promise<boolean> {
    const result = await this.dbBlogsRepository.delete({ id: id });
    return result.affected === 1;
  }
}
