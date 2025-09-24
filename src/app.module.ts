import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { TasksModule } from './tasks/tasks.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { SalesModule } from './sales/sales.module';
// import { ManagementsModule } from './managements/managements.module';
// import { ConnectionModule } from './connection/connection.module';
import { ConnectionGuestModule } from './connection_guest/connection_guest.module';

@Module({
  imports: [
    // PrismaModule,
    // TasksModule,
    // SalesModule,
    // ManagementsModule,
    // ConnectionModule,
    ConnectionGuestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
