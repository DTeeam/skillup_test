import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common'
import { PaginatedResult } from 'interfaces/paginated-result.interface'
import Logging from 'library/Logging'
import { Repository } from 'typeorm/repository/Repository'

@Injectable()
export abstract class AbstractService {
  constructor(protected readonly repository: Repository<any>) {}

  async findAll(relations: []): Promise<any> {
    try {
      return this.repository.find({ relations })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('List of elements failed to deliver :O')
    }
  }

  async findBy(condition, relations = []): Promise<any> {
    try {
      return this.repository.findOne({
        where: condition,
        relations,
      })
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Element search with condition failed :O')
    }
  }

  async findById(id: string, relations = []): Promise<any> {
    try {
      const element = await this.repository.findOne({
        where: { id },
        relations,
      })
      if (!element) {
        throw new BadRequestException(`Cannot find element with id: ${id}`)
      }
      return element
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Element search with id failed :O')
    }
  }

  async remove(id: string): Promise<any> {
    const element = await this.findById(id)
    try {
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException("Element wasn't deleted successfully")
    }
  }

  async paginate(page = 1, relations = []): Promise<PaginatedResult> {
    //10 people displayed per page
    const take = 10

    try {
      const [data, total] = await this.repository.findAndCount({
        take,
        skip: (page - 1) * take,
        relations,
      })
      return {
        data: data,
        meta: {
          total,
          page,
          last_page: Math.ceil(total / take),
        },
      }
    } catch (error) {
      Logging.error(error)
      throw new InternalServerErrorException('Paginated search result unsuccessful')
    }
  }
}