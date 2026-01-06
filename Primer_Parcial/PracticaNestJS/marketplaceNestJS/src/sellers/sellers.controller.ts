import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SellersService } from './sellers.service';
import { InventoriesService } from '../inventories/inventories.service';
import { CreateSellerDto } from './dto/create-seller.dto';
import { UpdateSellerDto } from './dto/update-seller.dto';

@Controller('sellers')
export class SellersController {
  constructor(
    private readonly sellersService: SellersService,
    private readonly inventoriesService: InventoriesService,
  ) {}

  @Post()
  create(@Body() createSellerDto: CreateSellerDto) {
    return this.sellersService.create(createSellerDto);
  }

  @Get()
  findAll() {
    return this.sellersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.sellersService.findOne(+id);
  }

  @Get(':id/inventory')
  findInventory(@Param('id') id: string) {
    return this.inventoriesService.findBySeller(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSellerDto: UpdateSellerDto) {
    return this.sellersService.update(+id, updateSellerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.sellersService.remove(+id);
  }
}
