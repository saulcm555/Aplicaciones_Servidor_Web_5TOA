import { Service } from "@domain/entities/service";
import { IServiceRepository } from "@domain/repositories/IServiceRepository";

export class ServiceService {
  constructor(private serviceRepository: IServiceRepository) {}

  createService(service: Service, callback: (err: Error | null, result?: Service) => void): void {
    this.serviceRepository.create(service, callback);
  }

  updateService(id: string, data: Partial<Service>): Promise<Service> {
    return this.serviceRepository.update(id, data);
  }

  async getServiceById(id: string): Promise<Service | null> {
    return await this.serviceRepository.findById(id);
  }

  async getAllServices(): Promise<Service[]> {
    return await this.serviceRepository.findAll();
  }

  async deleteService(id: string): Promise<boolean> {
    return await this.serviceRepository.delete(id);
  }
}
