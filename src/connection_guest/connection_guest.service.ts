import { ConflictException, Injectable } from '@nestjs/common';
import {
  SaleCCFguestDTO,
  SaleFCFguestDTO,
  SaleNTguestDTO,
  AnnulationSaleDTO,
  FXXguestDTO,
  sujExcluidoDTO,
} from './connection_guest.schema';

@Injectable()
export class ConnectionGuestService {
  private async firmador(nit: string, dteJson: object) {
    try {
      const pass_priv = String(process.env.PASSWORD_PRIV);
      const firmadorJson = {
        nit,
        activo: true,
        passwordPri: pass_priv,
        dteJson,
      };

      const firmador_url = String(process.env.FIRMADOR_URL);

      const firmador = await fetch(firmador_url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(firmadorJson),
      });

      const firmadorRes = (await firmador.json()) as {
        status: string;
        body: string;
      };
      const firma = firmadorRes.body;
      return { firma };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  private async authVerification() {
    try {
      const params = new URLSearchParams();
      params.append('user', '06141608191032');
      params.append('pwd', '1nBU6%00l5y0$s');

      const authProcess = await fetch(
        'https://apitest.dtes.mh.gob.sv/seguridad/auth',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'SIGMA',
          },
          body: params.toString(),
        },
      );

      const authRes = (await authProcess.json()) as {
        status: string;
        body: { token: string };
      };

      const token = authRes.body.token;

      return { token, authProcess };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  private async mhConnection(token: string, transactionJson: object) {
    try {
      const userAgent = String(process.env.USER_AGENT);
      const mhConnection = await fetch(
        'https://apitest.dtes.mh.gob.sv/fesv/recepciondte',
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/JSON',
            'User-Agent': userAgent,
          },
          body: JSON.stringify(transactionJson),
        },
      );

      if (mhConnection.status === 401) {
        const authProcess = await this.authVerification();
        return {
          message: 'token invalido. Probar nuevamente con el generado',
          authProcess,
        };
      }

      const mhConnectionRes = (await mhConnection.json()) as {
        estado: string;
        fhProcesamiento: string;
        selloRecibido: string;
        descripcionMsg: string;
        observaciones: string;
        statusText: string;
      };
      if (mhConnectionRes.estado === 'PROCESADO') {
        return {
          message: 'Venta exitosa',
          reception_stamp: mhConnectionRes.selloRecibido,
          fh_procesamiento: mhConnectionRes.fhProcesamiento,
        };
      } else {
        return {
          message: {
            message: 'Venta No procesada',
            descripcionMsg: mhConnectionRes.descripcionMsg,
            observaciones: mhConnectionRes.observaciones,
          },
        };
      }
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async connectionProcess(
    orgNit: string,
    dteJson: object,
    saleID: number,
    tipoDte: string,
    version: number,
    environment: string,
    generationCode: string,
    token: string,
  ) {
    try {
      const firmador = await this.firmador(orgNit, dteJson);
      const firma = firmador.firma;

      const transactionJson = {
        ambiente: environment,
        idEnvio: saleID,
        version,
        tipoDte,
        documento: firma,
        codigoGeneracion: generationCode,
      };

      const mhConnection = await this.mhConnection(token, transactionJson);
      if (mhConnection.message === 'venta exitosa') {
        return {
          message: 'Venta exitosa',
          reception_stamp: mhConnection.reception_stamp,
          fh_procesamiento: mhConnection.fh_procesamiento,
        };
      }
      return { mhConnection, firmador };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async annulationConnection(token: string, transactionJson: object) {
    try {
      const userAgent = String(process.env.USER_AGENT);
      const mhConnection = await fetch(
        'https://apitest.dtes.mh.gob.sv/fesv/anulardte',
        {
          method: 'POST',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/JSON',
            'User-Agent': userAgent,
          },
          body: JSON.stringify(transactionJson),
        },
      );

      if (mhConnection.status === 401) {
        const authProcess = await this.authVerification();
        return {
          message: 'token invalido. Probar nuevamente con el generado',
          authProcess,
        };
      }

      if (mhConnection.status === 400) {
        const bodyText = await mhConnection.text();

        let bodyJson: any;
        try {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          bodyJson = JSON.parse(bodyText);
        } catch {
          bodyJson = null;
        }

        return {
          message: 'Error 400, BAD REQUEST',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          observaciones: bodyJson?.observaciones ?? [],
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          descripcionMsg: bodyJson?.descripcionMsg ?? [],
        };
      }

      const mhConnectionRes = (await mhConnection.json()) as {
        estado: string;
        selloRecibido: string;
        observaciones: any[];
      };
      if (mhConnectionRes.estado === 'RECIBIDO') {
        return {
          message: 'Anulación exitosa',
          reception_stamp: mhConnectionRes.selloRecibido,
        };
      } else {
        return {
          message: {
            message: 'Anulación No procesada',
            observaciones: mhConnectionRes.observaciones,
          },
        };
      }
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async connectionAnnulationProcess(
    orgNit: string,
    dteJson: object,
    annulationID: number,
    version: number,
    environment: string,
    token: string,
  ) {
    try {
      const firmador = await this.firmador(orgNit, dteJson);
      const firma = firmador.firma;

      const transactionJson = {
        ambiente: environment,
        idEnvio: annulationID,
        version,
        documento: firma,
      };

      const mhConnection = await this.annulationConnection(
        token,
        transactionJson,
      );
      if (mhConnection.message === 'Anulación exitosa') {
        return {
          message: 'Anulación exitosa',
          reception_stamp: mhConnection.reception_stamp,
        };
      }
      return { mhConnection, firmador };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async saleFCF(data: SaleFCFguestDTO) {
    try {
      const documentBody = data.sale_details.map((detail, index) => ({
        numItem: detail.num_item ?? index + 1,
        tipoItem: detail.item_type,
        numeroDocumento: null,
        cantidad: detail.quantity,
        codigo: detail.internal_sale_code,
        codTributo: null,
        uniMedida: detail.measure_unit_code,
        descripcion: detail.measure_unit_name,
        precioUni: detail.unit_price,
        montoDescu: detail.discount_amount,
        ventaNoSuj: detail.no_suj_amount,
        ventaExenta: detail.exento_amount,
        ventaGravada: detail.gravado_amount,
        tributos: null,
        psv: 0.0,
        noGravado: 0.0,
        ivaItem: detail.iva_total,
      }));

      const identification = {
        version: data.factu_version,
        ambiente: data.environment,
        tipoDte: data.sale_type,
        numeroControl: data.dte_formatted,
        codigoGeneracion: data.generationCode,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: data.dateSale,
        horEmi: data.hourSale,
        tipoMoneda: 'USD',
      };

      const emisor = {
        nit: data.org_nit,
        nrc: data.org_nrc,
        nombre: data.org_name,
        codActividad: data.economyActivity_num,
        descActividad: data.economyActivity_name,
        nombreComercial: data.org_comercial_name,
        tipoEstablecimiento: data.establishment_type,
        direccion: {
          departamento: data.establishment_department,
          municipio: data.establishment_municipallity,
          complemento: data.establishment_address,
        },
        telefono: data.org_phone,
        correo: data.org_email,
        codEstableMH: data.mh_establishment,
        codEstable: data.establishment,
        codPuntoVentaMH: data.mh_sale_point,
        codPuntoVenta: data.sale_point,
      };

      const receptor = {
        tipoDocumento: data.client_doc_type,
        numDocumento: data.client_identity_code,
        nrc: data.client_nrc,
        nombre: data.client_name,
        codActividad: data.client_economic_activity_num || null,
        descActividad: data.client_economic_activity_name || null,
        direccion: data.client_address,
        telefono: data.client_phone_number,
        correo: data.client_email,
      };

      const resumen = {
        totalNoSuj: data.total_no_suj,
        totalExenta: data.total_exento,
        totalGravada: data.total_gravado,
        subTotalVentas: data.total_of_totals,
        descuNoSuj: data.discount_no_suj,
        descuExenta: data.discount_exento,
        descuGravada: data.discount_gravado,
        porcentajeDescuento: data.discount_total_percentage,
        totalDescu: data.discount_total,
        tributos: null,
        subTotal: data.total_with_discount,
        ivaRete1: data.iva_retention,
        reteRenta: data.tax_retention,
        montoTotalOperacion: data.total_amount,
        totalNoGravado: 0.0,
        totalPagar: data.total_amount,
        totalLetras: data.total_letters,
        totalIva: data.iva_total,
        saldoFavor: 0.0,
        condicionOperacion: data.operation_condition,
        pagos: null,
        numPagoElectronico: null,
      };

      const dteJson = {
        identificacion: identification,
        documentoRelacionado: null,
        emisor: emisor,
        receptor: receptor,
        otrosDocumentos: null,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
      };

      const connection = await this.connectionProcess(
        data.org_nit,
        dteJson,
        data.sale_id,
        data.sale_type,
        data.factu_version,
        data.environment,
        data.generationCode,
        data.token,
      );

      const dteJsonRes = {
        identificacion: identification,
        documentoRelacionado: null,
        emisor: emisor,
        receptor: receptor,
        otrosDocumentos: null,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
        reception_stamp: connection.reception_stamp || null,
        fh_procesamiento: connection.fh_procesamiento || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async saleCCF(data: SaleCCFguestDTO) {
    try {
      const documentBody = data.sale_details.map((detail, index) => ({
        numItem: detail.num_item ?? index + 1,
        tipoItem: detail.item_type,
        numeroDocumento: null,
        cantidad: detail.quantity,
        codigo: detail.internal_sale_code,
        codTributo: null,
        uniMedida: detail.measure_unit_code,
        descripcion: detail.measure_unit_name,
        precioUni: detail.unit_price,
        montoDescu: detail.discount_amount,
        ventaNoSuj: detail.no_suj_amount,
        ventaExenta: detail.exento_amount,
        ventaGravada: detail.gravado_amount,
        tributos: ['20'],
        psv: 0.0,
        noGravado: 0.0,
      }));

      const identification = {
        version: data.factu_version,
        ambiente: data.environment,
        tipoDte: data.sale_type,
        numeroControl: data.dte_formatted,
        codigoGeneracion: data.generationCode,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: data.dateSale,
        horEmi: data.hourSale,
        tipoMoneda: 'USD',
      };

      const emisor = {
        nit: data.org_nit,
        nrc: data.org_nrc,
        nombre: data.org_name,
        codActividad: data.economyActivity_num,
        descActividad: data.economyActivity_name,
        nombreComercial: data.org_comercial_name,
        tipoEstablecimiento: data.establishment_type,
        direccion: {
          departamento: data.establishment_department_code,
          municipio: data.establishment_municipallity_code,
          complemento: data.establishment_address,
        },
        telefono: data.org_phone,
        correo: data.org_email,
        codEstableMH: data.mh_establishment,
        codEstable: data.establishment,
        codPuntoVentaMH: data.mh_sale_point,
        codPuntoVenta: data.sale_point,
      };

      const receptor = {
        nit: data.client_nit,
        nrc: data.client_nrc,
        nombre: data.client_name,
        codActividad: data.client_economic_activity_num || null,
        descActividad: data.client_economic_activity_name || null,
        nombreComercial: null,
        direccion: {
          departamento: data.client_department_code,
          municipio: data.client_municipallity_code,
          complemento: data.client_address_complement,
        },
        telefono: data.client_phone_number,
        correo: data.client_email,
      };

      const resumen = {
        totalNoSuj: data.total_no_suj,
        totalExenta: data.total_exento,
        totalGravada: data.total_gravado,
        subTotalVentas: data.total_of_totals,
        descuNoSuj: data.discount_no_suj,
        descuExenta: data.discount_exento,
        descuGravada: data.discount_gravado,
        porcentajeDescuento: data.discount_total_percentage,
        totalDescu: data.discount_total,
        tributos: [
          {
            codigo: '20',
            descripcion: 'Impuesto al Valor Agregado 13%',
            valor: data.iva_total,
          },
        ],
        subTotal: data.total_with_discount,
        ivaPerci1: data.iva_perception,
        ivaRete1: data.iva_retention,
        reteRenta: data.tax_retention,
        montoTotalOperacion: data.total_amount,
        totalNoGravado: 0.0,
        totalPagar: data.total_amount,
        totalLetras: data.total_letters,
        saldoFavor: 0.0,
        condicionOperacion: data.operation_condition,
        pagos: null,
        numPagoElectronico: null,
      };

      const dteJson = {
        identificacion: identification,
        documentoRelacionado: null,
        emisor: emisor,
        receptor: receptor,
        otrosDocumentos: null,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
      };

      const connection = await this.connectionProcess(
        data.org_nit,
        dteJson,
        data.sale_id,
        data.sale_type,
        data.factu_version,
        data.environment,
        data.generationCode,
        data.token,
      );

      const dteJsonRes = {
        identificacion: identification,
        documentoRelacionado: null,
        emisor: emisor,
        receptor: receptor,
        otrosDocumentos: null,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
        reception_stamp: connection.reception_stamp || null,
        fh_procesamiento: connection.fh_procesamiento || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async saleNCC(data: SaleNTguestDTO) {
    try {
      const documentBody = data.sale_details.map((detail, index) => ({
        numItem: detail.num_item ?? index + 1,
        tipoItem: detail.item_type,
        numeroDocumento: data.generation_code_related_sale,
        cantidad: detail.quantity,
        codigo: detail.internal_sale_code,
        codTributo: null,
        uniMedida: detail.measure_unit_code,
        descripcion: detail.measure_unit_name,
        precioUni: detail.unit_price,
        montoDescu: detail.discount_amount,
        ventaNoSuj: detail.no_suj_amount,
        ventaExenta: detail.exento_amount,
        ventaGravada: detail.gravado_amount,
        tributos: ['20'],
      }));

      const identification = {
        version: data.factu_version,
        ambiente: data.environment,
        tipoDte: data.sale_type,
        numeroControl: data.dte_formatted,
        codigoGeneracion: data.generationCode,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: data.dateSale,
        horEmi: data.hourSale,
        tipoMoneda: 'USD',
      };

      const releatedDocument = [
        {
          tipoDocumento: '03',
          tipoGeneracion: 2,
          numeroDocumento: data.generation_code_related_sale,
          fechaEmision: data.date_related_sale,
        },
      ];

      const emisor = {
        nit: data.org_nit,
        nrc: data.org_nrc,
        nombre: data.org_name,
        codActividad: data.economyActivity_num,
        descActividad: data.economyActivity_name,
        nombreComercial: data.org_comercial_name,
        tipoEstablecimiento: data.establishment_type,
        direccion: {
          departamento: data.establishment_department_code,
          municipio: data.establishment_municipallity_code,
          complemento: data.establishment_address,
        },
        telefono: data.org_phone,
        correo: data.org_email,
      };

      const receptor = {
        nit: data.client_nit,
        nrc: data.client_nrc,
        nombre: data.client_name,
        codActividad: data.client_economic_activity_num,
        descActividad: data.client_economic_activity_name,
        nombreComercial: null,
        direccion: {
          departamento: data.client_department_code,
          municipio: data.client_municipallity_code,
          complemento: data.client_address_complement,
        },
        telefono: data.client_phone_number,
        correo: data.client_email,
      };

      const resumen = {
        totalNoSuj: data.total_no_suj,
        totalExenta: data.total_exento,
        totalGravada: data.total_gravado,
        subTotalVentas: data.total_of_totals,
        descuNoSuj: data.discount_no_suj,
        descuExenta: data.discount_exento,
        descuGravada: data.discount_gravado,
        totalDescu: data.discount_total,
        tributos: [
          {
            codigo: '20',
            descripcion: 'Impuesto al Valor Agregado 13%',
            valor: data.iva_total,
          },
        ],
        subTotal: data.total_with_discount,
        ivaPerci1: data.iva_perception,
        ivaRete1: data.iva_retention,
        reteRenta: data.tax_retention,
        montoTotalOperacion: data.total_amount,
        totalLetras: data.total_letters,
        condicionOperacion: data.operation_condition,
      };

      const dteJson = {
        identificacion: identification,
        documentoRelacionado: releatedDocument,
        emisor: emisor,
        receptor: receptor,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
      };

      const connection = await this.connectionProcess(
        data.org_nit,
        dteJson,
        data.sale_id,
        data.sale_type,
        data.factu_version,
        data.environment,
        data.generationCode,
        data.token,
      );

      const dteJsonRes = {
        identificacion: identification,
        documentoRelacionado: releatedDocument,
        emisor: emisor,
        receptor: receptor,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
        reception_stamp: connection.reception_stamp || null,
        fh_procesamiento: connection.fh_procesamiento || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async saleNDD(data: SaleNTguestDTO) {
    try {
      const documentBody = data.sale_details.map((detail, index) => ({
        numItem: detail.num_item ?? index + 1,
        tipoItem: detail.item_type,
        numeroDocumento: data.generation_code_related_sale,
        cantidad: detail.quantity,
        codigo: detail.internal_sale_code,
        codTributo: null,
        uniMedida: detail.measure_unit_code,
        descripcion: detail.measure_unit_name,
        precioUni: detail.unit_price,
        montoDescu: detail.discount_amount,
        ventaNoSuj: detail.no_suj_amount,
        ventaExenta: detail.exento_amount,
        ventaGravada: detail.gravado_amount,
        tributos: ['20'],
      }));

      const identification = {
        version: data.factu_version,
        ambiente: data.environment,
        tipoDte: data.sale_type,
        numeroControl: data.dte_formatted,
        codigoGeneracion: data.generationCode,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: data.dateSale,
        horEmi: data.hourSale,
        tipoMoneda: 'USD',
      };

      const releatedDocument = [
        {
          tipoDocumento: '03',
          tipoGeneracion: 2,
          numeroDocumento: data.generation_code_related_sale,
          fechaEmision: data.date_related_sale,
        },
      ];

      const emisor = {
        nit: data.org_nit,
        nrc: data.org_nrc,
        nombre: data.org_name,
        codActividad: data.economyActivity_num,
        descActividad: data.economyActivity_name,
        nombreComercial: data.org_comercial_name,
        tipoEstablecimiento: data.establishment_type,
        direccion: {
          departamento: data.establishment_department_code,
          municipio: data.establishment_municipallity_code,
          complemento: data.establishment_address,
        },
        telefono: data.org_phone,
        correo: data.org_email,
      };

      const receptor = {
        nit: data.client_nit,
        nrc: data.client_nrc,
        nombre: data.client_name,
        codActividad: data.client_economic_activity_num,
        descActividad: data.client_economic_activity_name,
        nombreComercial: null,
        direccion: {
          departamento: data.client_department_code,
          municipio: data.client_municipallity_code,
          complemento: data.client_address_complement,
        },
        telefono: data.client_phone_number,
        correo: data.client_email,
      };

      const resumen = {
        totalNoSuj: data.total_no_suj,
        totalExenta: data.total_exento,
        totalGravada: data.total_gravado,
        subTotalVentas: data.total_of_totals,
        descuNoSuj: data.discount_no_suj,
        descuExenta: data.discount_exento,
        descuGravada: data.discount_gravado,
        totalDescu: data.discount_total,
        tributos: [
          {
            codigo: '20',
            descripcion: 'Impuesto al Valor Agregado 13%',
            valor: data.iva_total,
          },
        ],
        subTotal: data.total_with_discount,
        ivaPerci1: data.iva_perception,
        ivaRete1: data.iva_retention,
        reteRenta: data.tax_retention,
        montoTotalOperacion: data.total_amount,
        totalLetras: data.total_letters,
        condicionOperacion: data.operation_condition,
        numPagoElectronico: null,
      };

      const dteJson = {
        identificacion: identification,
        documentoRelacionado: releatedDocument,
        emisor: emisor,
        receptor: receptor,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
      };

      const connection = await this.connectionProcess(
        data.org_nit,
        dteJson,
        data.sale_id,
        data.sale_type,
        data.factu_version,
        data.environment,
        data.generationCode,
        data.token,
      );

      const dteJsonRes = {
        identificacion: identification,
        documentoRelacionado: releatedDocument,
        emisor: emisor,
        receptor: receptor,
        ventaTercero: null,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        extension: null,
        apendice: null,
        reception_stamp: connection.reception_stamp || null,
        fh_procesamiento: connection.fh_procesamiento || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async exportationFacSale(data: FXXguestDTO) {
    try {
      const identificacion = {
        version: data.factu_version,
        ambiente: data.environment,
        tipoDte: data.sale_type,
        numeroControl: data.dte_formatted,
        codigoGeneracion: data.generationCode,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContigencia: null,
        fecEmi: data.dateSale,
        horEmi: data.hourSale,
        tipoMoneda: 'USD',
      };

      const emisor = {
        nit: data.org_nit,
        nrc: data.org_nrc,
        nombre: data.org_name,
        codActividad: data.economyActivity_num,
        descActividad: data.economyActivity_name,
        nombreComercial: data.org_comercial_name,
        tipoEstablecimiento: data.establishment_type,
        direccion: {
          departamento: data.establishment_department_code,
          municipio: data.establishment_municipallity_code,
          complemento: data.establishment_address,
        },
        telefono: data.org_phone,
        correo: data.org_email,
        codEstableMH: data.mh_establishment,
        codEstable: data.establishment,
        codPuntoVentaMH: data.mh_sale_point,
        codPuntoVenta: data.sale_point,
        tipoItemExpor: data.item_export_type,
        recintoFiscal: data.fiscal_recinct,
        regimen: data.tax_regime,
      };

      const receptor = {
        nombre: data.client_name,
        tipoDocumento: data.client_doc_type,
        numDocumento: data.client_identity_code,
        nombreComercial: null,
        codPais: data.client_country_code,
        nombrePais: data.client_country_name,
        complemento: data.client_address_complement,
        tipoPersona: data.client_type,
        descActividad: data.client_economic_activity_name || null,
        telefono: data.client_phone_number,
        correo: data.client_email,
      };

      const otrosDocumentos =
        data.otrosDocumentos?.map((doc) => ({
          codDocAsociado: doc.codDocAsociado,
          descDocumento: doc.descDocumento,
          detalleDocumento: doc.detalleDocumento,
          modoTransp: doc.modoTransp || null,
          placaTrans: doc.placaTrans || null,
          numConductor: doc.numConductor || null,
          nombreConductor: doc.nombreConductor || null,
        })) || [];

      const ventaTercero = null;

      const cuerpoDocumento =
        data.cuerpoDocumento?.map((item) => ({
          numItem: item.numItem,
          cantidad: item.cantidad,
          codigo: item.codigo,
          uniMedida: item.uniMedida,
          descripcion: item.descripcion,
          precioUni: item.precioUni,
          montoDescu: item.montoDescu,
          ventaGravada: item.ventaGravada,
          tributos: item.tributos,
          noGravado: item.noGravado,
        })) || [];

      const resumen = {
        totalGravada: data.totalGravada,
        descuento: data.descuento,
        porcentajeDescuento: data.porcentajeDescuento,
        totalDescu: data.totalDescu,
        seguro: data.seguro,
        flete: data.flete,
        montoTotalOperacion: data.montoTotalOperacion,
        totalNoGravado: data.totalNoGravado,
        totalPagar: data.totalPagar,
        totalLetras: data.totalLetras,
        condicionOperacion: data.condicionOperacion,
        pagos:
          data.pagos?.map((pago) => ({
            codigo: pago.codigo,
            montoPago: pago.montoPago,
            referencia: pago.referencia,
            plazo: pago.plazo || null,
            periodo: pago.periodo || null,
          })) || [],
        codIncoterms: data.codIncoterms,
        descIncoterms: data.descIncoterms,
        numPagoElectronico: data.numPagoElectronico,
        observaciones: data.observaciones,
      };

      const apendice =
        data.apendice?.map((ap) => ({
          campo: ap.campo,
          etiqueta: ap.etiqueta,
          valor: ap.valor,
        })) || [];

      const dteJson = {
        identificacion,
        emisor,
        receptor,
        otrosDocumentos,
        ventaTercero,
        cuerpoDocumento,
        resumen,
        apendice,
      };

      const connection = await this.connectionProcess(
        data.org_nit,
        dteJson,
        data.sale_id,
        data.sale_type,
        data.factu_version,
        data.environment,
        data.generationCode,
        data.token,
      );

      const dteJsonRes = {
        identificacion,
        emisor,
        receptor,
        otrosDocumentos,
        ventaTercero,
        cuerpoDocumento,
        resumen,
        apendice,
        reception_stamp: connection.reception_stamp || null,
        fh_procesamiento: connection.fh_procesamiento || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async sujExcluido(data: sujExcluidoDTO) {
    try {
      const documentBody = data.sale_details.map((detail, index) => ({
        numItem: detail.numItem ?? index + 1,
        tipoItem: detail.item_type,
        cantidad: detail.quantity,
        codigo: detail.internal_sale_code,
        uniMedida: detail.measure_unit_code,
        descripcion: detail.measure_unit_name,
        precioUni: detail.unit_price,
        montoDescu: detail.discount_amount,
        compra: detail.amount,
      }));

      const identification = {
        version: data.factu_version,
        ambiente: data.environment,
        tipoDte: data.sale_type,
        numeroControl: data.dte_formatted,
        codigoGeneracion: data.generationCode,
        tipoModelo: 1,
        tipoOperacion: 1,
        tipoContingencia: null,
        motivoContin: null,
        fecEmi: data.dateSale,
        horEmi: data.hourSale,
        tipoMoneda: 'USD',
      };

      const emisor = {
        nit: data.org_nit,
        nrc: data.org_nrc,
        nombre: data.org_name,
        codActividad: data.economyActivity_num,
        descActividad: data.economyActivity_name,
        direccion: {
          departamento: data.establishment_department_code,
          municipio: data.establishment_municipallity_code,
          complemento: data.establishment_address,
        },
        telefono: data.org_phone,
        correo: data.org_email,
        codEstableMH: data.mh_establishment,
        codEstable: data.establishment,
        codPuntoVentaMH: data.mh_sale_point,
        codPuntoVenta: data.sale_point,
      };

      const sujetoExcluido = {
        tipoDocumento: data.client_doc_type,
        numDocumento: data.client_identity_code,
        nombre: data.client_name,
        codActividad: data.client_economic_activity_num || null,
        descActividad: data.client_economic_activity_name || null,
        direccion: {
          departamento: data.client_address_department,
          municipio: data.client_address_municipallity,
          complemento: data.client_address_complement,
        },
        telefono: data.client_phone_number,
        correo: data.client_email,
      };

      const resumen = {
        totalCompra: data.totalCompra,
        descu: data.descuento,
        totalDescu: data.totalDescu,
        subTotal: data.subTotal,
        ivaRete1: data.ivaRete1,
        reteRenta: data.reteRenta,
        totalPagar: data.totalPagar,
        totalLetras: data.totalLetras,
        condicionOperacion: data.condicionOperacion,
        pagos:
          data.pagos?.map((pago) => ({
            codigo: pago.codigo,
            montoPago: pago.montoPago,
            referencia: pago.referencia,
            plazo: pago.plazo || null,
            periodo: pago.periodo || null,
          })) || [],
        observaciones: data.observaciones,
      };

      const apendice =
        data.apendice?.map((ap) => ({
          campo: ap.campo,
          etiqueta: ap.etiqueta,
          valor: ap.valor,
        })) || [];

      const dteJson = {
        identificacion: identification,
        emisor: emisor,
        sujetoExcluido,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        apendice,
      };

      const connection = await this.connectionProcess(
        data.org_nit,
        dteJson,
        data.sale_id,
        data.sale_type,
        data.factu_version,
        data.environment,
        data.generationCode,
        data.token,
      );

      const dteJsonRes = {
        identificacion: identification,
        emisor: emisor,
        sujetoExcluido,
        cuerpoDocumento: documentBody,
        resumen: resumen,
        reception_stamp: connection.reception_stamp || null,
        fh_procesamiento: connection.fh_procesamiento || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async annulationSale(data: AnnulationSaleDTO) {
    try {
      const identification = {
        version: data.factu_version,
        ambiente: data.environment,
        codigoGeneracion: data.generationCode,
        fecAnula: data.dateNullSale,
        horAnula: data.hourNullSale,
      };

      const emisor = {
        nit: data.org_nit,
        nombre: data.org_name,
        tipoEstablecimiento: data.establishment_type,
        telefono: data.org_phone,
        correo: data.org_email,
        codEstableMH: data.mh_establishment,
        codEstable: data.establishment,
        codPuntoVentaMH: data.mh_sale_point,
        codPuntoVenta: data.sale_point,
        nomEstablecimiento: data.establishment,
      };

      const documento = {
        tipoDte: data.relatted_sale_type,
        codigoGeneracion: data.relatted_sale_generation_code,
        selloRecibido: data.relatted_sale_reception_stamp,
        numeroControl: data.relatted_sale_dte_number,
        fecEmi: data.relatted_sale_date,
        montoIva: data.relatted_sale_iva_amount,
        codigoGeneracionR: null,
        tipoDocumento: data.relatted_sale_client_document_type,
        numDocumento: data.relatted_sale_client_document_number,
        nombre: data.relatted_sale_client_name,
        telefono: data.relatted_sale_client_phone,
        correo: data.relatted_sale_client_email,
      };

      const motivo = {
        tipoAnulacion: data.motivation_code, // 1 error, 2 cancelación, 3 otros
        motivoAnulacion: data.motivation_description,
        nombreResponsable: data.responsible_agent_name,
        tipDocResponsable: data.responsible_agent_document_type,
        numDocResponsable: data.responsible_agent_document_number,
        nombreSolicita: data.solicitor_name,
        tipDocSolicita: data.solicitor_document_type,
        numDocSolicita: data.solicitor_document_number,
      };

      const dteJson = {
        identificacion: identification,
        emisor: emisor,
        documento,
        motivo,
      };

      const connection = await this.connectionAnnulationProcess(
        data.org_nit,
        dteJson,
        Number(data.annulation_id),
        data.factu_version,
        data.environment,
        data.token,
      );

      const dteJsonRes = {
        identificacion: identification,
        emisor,
        documento,
        motivo,
        reception_stamp: connection.reception_stamp || null,
      };

      return { connection, dteJsonRes };
    } catch (error) {
      throw new ConflictException(error);
    }
  }
}
