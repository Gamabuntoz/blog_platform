import { Injectable } from '@nestjs/common';
import { QueryBlogsDTO } from '../../public/blogs/applications/blogs.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blogs } from '../../blogger/blogger_blogs/applications/blogger-blogs.entity';
import { Users } from '../sa_users/applications/users.entity';

@Injectable()
export class SABlogsRepository {
  constructor(
    @InjectRepository(Blogs)
    private readonly dbBlogsRepository: Repository<Blogs>,
  ) {}

  async findBlogById(id: string) {
    return this.dbBlogsRepository.findOne({ where: { id: id } });
  }

  async banBlogById(id: string, status: boolean): Promise<boolean> {
    const result = await this.dbBlogsRepository.update(
      { id: id },
      {
        blogIsBanned: status,
        blogBanDate: status ? new Date().toISOString() : null,
      },
    );
    return result.affected === 1;
  }

  async findAllBlogs(filter: any, sortBy: string, queryData: QueryBlogsDTO) {
    const direction = queryData.sortDirection.toUpperCase();
    try {
      const queryBuilder = await this.dbBlogsRepository.createQueryBuilder('b');
      if (filter.searchNameTerm) {
        queryBuilder.where("name ILIKE '%' || :nameTerm || '%'", {
          nameTerm: filter.searchNameTerm,
        });
      }
      queryBuilder
        .orderBy(`b.${sortBy}`, (direction as 'ASC') || 'DESC')
        .limit(queryData.pageSize)
        .offset((queryData.pageNumber - 1) * queryData.pageSize);
      return queryBuilder.getMany();
    } catch (e) {
      console.log(e.message);
      console.log('catch in the find all blogs in SA repo');
    }
  }

  async totalCountBlogs(filter: any) {
    try {
      const queryBuilder = await this.dbBlogsRepository.createQueryBuilder('b');
      if (filter.searchNameTerm) {
        queryBuilder.where("name ILIKE '%' || :nameTerm || '%'", {
          nameTerm: filter.searchNameTerm,
        });
      }
      return queryBuilder.getCount();
    } catch (e) {
      console.log(e.message);
      console.log('catch in the total count blogs in SA repo');
    }
  }

  async bindBlogWithUser(
    blogId: string,
    user: Users,
    userLogin: string,
  ): Promise<boolean> {
    const result = await this.dbBlogsRepository.update(
      { id: blogId },
      {
        user: user,
        ownerLogin: userLogin,
      },
    );
    return result.affected === 1;
  }
}
