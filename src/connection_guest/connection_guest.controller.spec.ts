import { Test, TestingModule } from '@nestjs/testing';
import { ConnectionGuestController } from './connection_guest.controller';

describe('ConnectionGuestController', () => {
  let controller: ConnectionGuestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConnectionGuestController],
    }).compile();

    controller = module.get<ConnectionGuestController>(
      ConnectionGuestController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
