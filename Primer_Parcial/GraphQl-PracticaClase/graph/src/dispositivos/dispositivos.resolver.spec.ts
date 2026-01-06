import { Test, TestingModule } from '@nestjs/testing';
import { DispositivosResolver } from './dispositivos.resolver';
import { DispositivosService } from './dispositivos.service';

describe('DispositivosResolver', () => {
  let resolver: DispositivosResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DispositivosResolver, DispositivosService],
    }).compile();

    resolver = module.get<DispositivosResolver>(DispositivosResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
