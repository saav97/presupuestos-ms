import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaClient } from '@prisma/client';
import { RpcException } from '@nestjs/microservices';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { ChangeOrderStatusDto } from './dto';

@Injectable()
export class OrdersService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('OrderService')

  async onModuleInit() {
    await this.$connect();
    this.logger.log(`Database connected`)
  }
  create(createOrderDto: CreateOrderDto) {
    return this.order.create({
      data: createOrderDto
    })
  }

  async findAll(orderPaginationDto: OrderPaginationDto) {

    const totalPages = await this.order.count({
      where: {
        status: orderPaginationDto.status
      }
    })

    const currentPage = orderPaginationDto.page;
    const perPage = orderPaginationDto.limit;

    return {
      data: await this.order.findMany({
        skip: (currentPage - 1) * perPage,
        take: perPage,
        where: {
          status: orderPaginationDto.status
        }
      }),
      meta: {
        total: totalPages,
        page: currentPage,
        lastPage: Math.ceil(totalPages/perPage)
      }
    }
  }

  async findOne(id: string) {
    const order = await this.order.findUnique({
      where: {
        id
      }
    })

    if (!order) {
      throw new RpcException({
        message: `Insumos with id #${id} not found`,
        status: HttpStatus.BAD_REQUEST
      })
    }

    return order;

  }

  async changeStatus(changeOderStatusDto: ChangeOrderStatusDto){
    const  {id, status} = changeOderStatusDto;
    
    const order = await this.findOne(id);

    if (order.status === status){
      return order;
    }

    return this.order.update({
      where: {id},
      data: {status: status}
    })
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
