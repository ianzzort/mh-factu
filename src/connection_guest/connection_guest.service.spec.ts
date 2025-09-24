import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionGuestService } from './connection_guest.service';

describe('ConnectionGuestService', () => {
  let service: ConnectionGuestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConnectionGuestService],
    }).compile();

    service = module.get<ConnectionGuestService>(ConnectionGuestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
