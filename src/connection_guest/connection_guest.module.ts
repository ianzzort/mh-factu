import { Module } from '@nestjs/common';
import { ConnectionGuestController } from './connection_guest.controller';
import { ConnectionGuestService } from './connection_guest.service';

@Module({
  controllers: [ConnectionGuestController],
  providers: [ConnectionGuestService],
})
export class ConnectionGuestModule {}
