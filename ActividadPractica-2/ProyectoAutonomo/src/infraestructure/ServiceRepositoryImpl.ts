import { Service } from "@domain/entities/service";
import { IServiceRepository } from "@domain/repositories/IServiceRepository";

export class ServiceRepositoryImpl implements IServiceRepository {
  private services: Service[] = [];
  private currentId = 1;

  create(
    service: Service,
    callback: (error: Error | null, result?: Service) => void
  ): void {
    try {
      if (!service.service_type || !service.service_name) {
        return callback(new Error("Service must have type and name."));
      }
      const newService: Service = {
        ...service,
        id_service: this.currentId++,
        created_at: new Date(),
        updated_at: new Date(),
      };
      this.services.push(newService);
      callback(null, newService);
    } catch (error) {
      callback(error as Error);
    }
  }

  async update(id: string, data: Partial<Service>): Promise<Service> {
    const serviceId = parseInt(id, 10);
    const index = this.services.findIndex((s) => s.id_service === serviceId);
    if (index === -1) {
      throw new Error(`Service with id ${id} not found`);
    }
    this.services[index] = {
      ...this.services[index]!,
      ...data,
      updated_at: new Date(),
    };
    return this.services[index]!;
  }

  async findById(id: string): Promise<Service | null> {
    const serviceId = parseInt(id, 10);
    const service = this.services.find((s) => s.id_service === serviceId);
    return service || null;
  }

  async findAll(): Promise<Service[]> {
    return this.services;
  }

  async delete(id: string): Promise<boolean> {
    const serviceId = parseInt(id, 10);
    const index = this.services.findIndex((s) => s.id_service === serviceId);
    if (index === -1) {
      return false;
    }
    this.services.splice(index, 1);
    return true;
  }
}
