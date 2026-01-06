import { Injectable, Inject, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @Inject('ORDERS_SERVICE') private ordersClient: ClientProxy,
  ) {}

  // ============================================
  // CRUD Operations (REST API)
  // ============================================

  async findAll(): Promise<Product[]> {
    this.logger.log('Fetching all products');
    return this.productRepository.find();
  }

  async findOne(id: string): Promise<Product> {
    this.logger.log(`Fetching product with ID: ${id}`);
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    return product;
  }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    this.logger.log(`Creating new product: ${createProductDto.name}`);
    
    const product = this.productRepository.create(createProductDto);
    const savedProduct = await this.productRepository.save(product);
    
    // Publicar evento de producto creado
    this.ordersClient.emit('product.created', {
      productId: savedProduct.id,
      name: savedProduct.name,
      price: savedProduct.price,
      stock: savedProduct.stock,
      timestamp: new Date().toISOString(),
    });
    
    this.logger.log(`Product created: ${savedProduct.id}`);
    return savedProduct;
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<Product> {
    this.logger.log(`Updating product with ID: ${id}`);
    
    const product = await this.findOne(id);
    
    Object.assign(product, updateProductDto);
    const updatedProduct = await this.productRepository.save(product);
    
    // Publicar evento de producto actualizado
    this.ordersClient.emit('product.updated', {
      productId: updatedProduct.id,
      name: updatedProduct.name,
      price: updatedProduct.price,
      stock: updatedProduct.stock,
      timestamp: new Date().toISOString(),
    });
    
    this.logger.log(`Product updated: ${updatedProduct.id}`);
    return updatedProduct;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting product with ID: ${id}`);
    
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    
    // Publicar evento de producto eliminado
    this.ordersClient.emit('product.deleted', {
      productId: id,
      timestamp: new Date().toISOString(),
    });
    
    this.logger.log(`Product deleted: ${id}`);
  }

  // ============================================
  // Event-Driven Operations (RabbitMQ)
  // ============================================

  async reserveStock(productId: string, quantity: number, idempotencyKey: string) {
    this.logger.log(`Reserve stock request for product ${productId}, quantity: ${quantity}, key: ${idempotencyKey}`);

    const product = await this.productRepository.findOne({ where: { id: productId } });

    let result;

    if (!product) {
      this.logger.warn(`Product ${productId} not found`);
      result = {
        approved: false,
        reason: 'PRODUCT_NOT_FOUND',
        idempotencyKey,
      };
    } else if (product.stock < quantity) {
      this.logger.warn(`Insufficient stock for product ${productId}. Available: ${product.stock}, Requested: ${quantity}`);
      result = {
        approved: false,
        reason: 'OUT_OF_STOCK',
        idempotencyKey,
      };
    } else {
      product.stock -= quantity;
      await this.productRepository.save(product);
      this.logger.log(`Stock reserved for product ${productId}. New stock: ${product.stock}`);

      result = {
        approved: true,
        productId,
        quantity,
        idempotencyKey,
      };
    }

    // Enviar evento de respuesta al Orders Service
    this.ordersClient.emit('product.stockReserved', result);

    return result;
  }
}
