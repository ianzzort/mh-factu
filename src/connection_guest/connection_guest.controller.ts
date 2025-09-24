import { Controller, Post, Body } from '@nestjs/common';
import {
  AnnulationSaleDTO,
  FXXguestDTO,
  SaleCCFguestDTO,
  SaleFCFguestDTO,
  SaleNTguestDTO,
  sujExcluidoDTO,
} from './connection_guest.schema';
import { ConnectionGuestService } from './connection_guest.service';

@Controller('connection-guest')
export class ConnectionGuestController {
  constructor(
    private readonly serviceGuestConnection: ConnectionGuestService,
  ) {}

  @Post('/fcf')
  async sendFCF(@Body() data: SaleFCFguestDTO) {
    return await this.serviceGuestConnection.saleFCF(data);
  }

  @Post('/ccf')
  async sendCCF(@Body() data: SaleCCFguestDTO) {
    return await this.serviceGuestConnection.saleCCF(data);
  }

  @Post('/ncc')
  async sendNCC(@Body() data: SaleNTguestDTO) {
    return await this.serviceGuestConnection.saleNCC(data);
  }

  @Post('/ndd')
  async sendNDD(@Body() data: SaleNTguestDTO) {
    return await this.serviceGuestConnection.saleNDD(data);
  }

  @Post('/fxx')
  async sendExportation(@Body() data: FXXguestDTO) {
    return await this.serviceGuestConnection.exportationFacSale(data);
  }

  @Post('/sujx')
  async sujx(@Body() data: sujExcluidoDTO) {
    return await this.serviceGuestConnection.sujExcluido(data);
  }

  @Post('/annulation')
  async sendNull(@Body() data: AnnulationSaleDTO) {
    return await this.serviceGuestConnection.annulationSale(data);
  }
}
