import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { AdminsService } from './admins.service';
import { Admin } from './entities/admin.entity';

@Resolver(() => Admin)
export class AdminsResolver {
  constructor(private readonly adminsService: AdminsService) {}

  @Query(() => [Admin], { name: 'admins', description: 'Get all admins' })
  findAll() {
    return this.adminsService.findAll();
  }

  @Query(() => Admin, { name: 'admin', description: 'Get an admin by ID' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.adminsService.findOne(id);
  }
}
