import { Test, TestingModule } from '@nestjs/testing';
import { DispositivosGateway } from './dispositivos.gateway';
import { DispositivosService } from './dispositivos.service';

describe('DispositivosGateway', () => {
  let gateway: DispositivosGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispositivosGateway, DispositivosService],
    }).compile();

    gateway = module.get<DispositivosGateway>(DispositivosGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
