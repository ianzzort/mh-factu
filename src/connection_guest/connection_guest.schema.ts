// FACTURA DE CONSUMIDOR FINAL

export interface SaleFCFDetailDTO {
  num_item?: number;
  item_type: string | number;
  solutions_sale: string | number;
  quantity: number;
  internal_sale_code: string;
  measure_unit_code: string | number;
  measure_unit_name: string | number;
  unit_price: number;
  discount_amount: number;
  no_suj_amount: number;
  exento_amount: number;
  gravado_amount: number;
  iva_total: number;
}

export interface SaleFCFguestDTO {
  //agregado
  sale_id: number;
  token: string;

  // Identificación
  factu_version: number;
  environment: string;
  sale_type: string;
  dte_formatted: string;
  generationCode: string;
  dateSale: string; // ISO "YYYY-MM-DD"
  hourSale: string; // formato "HH:mm:ss"

  // Emisor
  org_nit: string;
  org_nrc: string;
  org_name: string;
  economyActivity_num: string;
  economyActivity_name: string;
  org_comercial_name: string;
  establishment_type: string;
  establishment_department: string;
  establishment_municipallity: string;
  establishment_address: string;
  org_phone: string;
  org_email: string;
  mh_establishment: string;
  establishment: string;
  mh_sale_point: string;
  sale_point: string;

  // Receptor
  client_doc_type?: string;
  client_identity_code: string;
  client_nrc?: string;
  client_name: string;
  client_economic_activity_num?: string | number;
  client_economic_activity_name?: string;
  client_address: string;
  client_phone_number?: string;
  client_email?: string;

  // Resumen
  total_no_suj: number;
  total_exento: number;
  total_gravado: number;
  total_of_totals: number;
  discount_no_suj: number;
  discount_exento: number;
  discount_gravado: number;
  discount_total_percentage: number;
  discount_total: number;
  total_with_discount: number;
  iva_retention: number;
  tax_retention: number;
  total_amount: number;
  total_letters: string;
  iva_total: number;
  operation_condition: number;

  // Detalle
  sale_details: SaleFCFDetailDTO[];
}

export interface SaleCCFDetailDTO {
  num_item?: number;
  item_type: string | number;
  quantity: number;
  internal_sale_code: string;
  measure_unit_code: string | number;
  measure_unit_name: string | number;
  unit_price: number;
  discount_amount: number;
  no_suj_amount: number;
  exento_amount: number;
  gravado_amount: number;
}

// CREDITO FISCAL

export interface SaleCCFguestDTO {
  // Agregado
  sale_id: number;
  token: string;

  // Identificación
  factu_version: number; // en service: 3
  environment: string;
  sale_type: string;
  dte_formatted: string;
  generationCode: string;
  dateSale: string; // ISO "YYYY-MM-DD"
  hourSale: string; // formato "HH:mm:ss"

  // Emisor
  org_nit: string;
  org_nrc: string;
  org_name: string;
  economyActivity_num: string;
  economyActivity_name: string;
  org_comercial_name: string;
  establishment_type: string;
  establishment_department_code: string;
  establishment_municipallity_code: string;
  establishment_address: string;
  org_phone: string;
  org_email: string;
  mh_establishment: string;
  establishment: string;
  mh_sale_point: string;
  sale_point: string;

  // Receptor
  client_nit: string;
  client_nrc: string;
  client_name: string;
  client_economic_activity_num?: string | number;
  client_economic_activity_name?: string;
  client_department_code: string;
  client_municipallity_code: string;
  client_address_complement: string;
  client_phone_number?: string;
  client_email?: string;

  // Resumen
  total_no_suj: number;
  total_exento: number;
  total_gravado: number;
  total_of_totals: number;
  discount_no_suj: number;
  discount_exento: number;
  discount_gravado: number;
  discount_total_percentage: number;
  discount_total: number;
  total_with_discount: number;
  iva_perception: number;
  iva_retention: number;
  tax_retention: number;
  total_amount: number;
  total_letters: string;
  iva_total: number;
  operation_condition: number;

  // Detalle
  sale_details: SaleCCFDetailDTO[];
}

// NOTAS

// Detalle de la Nota
export interface SaleNTDetailDTO {
  num_item?: number;
  item_type: string | number;
  quantity: number;
  internal_sale_code: string;
  measure_unit_code: string | number;
  measure_unit_name: string | number;
  unit_price: number;
  discount_amount: number;
  no_suj_amount: number;
  exento_amount: number;
  gravado_amount: number;
  iva_total: number;
}

// Documento principal de la Nota de Crédito al Consumidor
export interface SaleNTguestDTO {
  // Extras de integración
  sale_id: number;
  token: string;

  // Identificación
  factu_version: number;
  environment: string;
  sale_type: string;
  dte_formatted: string;
  generationCode: string;
  dateSale: string; // ISO "YYYY-MM-DD"
  hourSale: string; // formato "HH:mm:ss"

  // Documento relacionado (la factura/CCF al que corrige)
  generation_code_related_sale: string;
  date_related_sale: string; // "YYYY-MM-DD"

  // Emisor
  org_nit: string;
  org_nrc: string;
  org_name: string;
  economyActivity_num: string;
  economyActivity_name: string;
  org_comercial_name: string;
  establishment_type: string;
  establishment_department_code: string;
  establishment_municipallity_code: string;
  establishment_address: string;
  org_phone: string;
  establishment_department: string;
  establishment_municipallity: string;
  org_email: string;
  mh_establishment?: string;
  establishment?: string;
  mh_sale_point?: string;
  sale_point?: string;

  // Receptor
  client_nit: string;
  client_nrc?: string;
  client_name: string;
  client_economic_activity_num?: string | number;
  client_economic_activity_name?: string;
  client_department_code: string;
  client_municipallity_code: string;
  client_address_complement: string;
  client_address: string;
  client_phone_number?: string;
  client_email?: string;

  // Resumen
  total_no_suj: number;
  total_exento: number;

  total_gravado: number;
  total_of_totals: number;
  discount_no_suj: number;
  discount_exento: number;
  discount_gravado: number;
  discount_total: number;
  total_with_discount: number;
  iva_total: number;
  iva_perception: number;
  iva_retention: number;
  tax_retention: number;
  total_amount: number;
  total_letters: string;
  operation_condition: number;

  // Detalles
  sale_details: SaleNTDetailDTO[];
}

export interface AnnulationSaleDTO {
  // Conexión
  annulation_id: string;
  sale_type: string;
  token: string;

  // Identificación
  factu_version: number;
  environment: string; // '00' | '01'
  generationCode: string;
  dateNullSale: string; // formato fecha YYYY-MM-DD
  hourNullSale: string; // formato HH:MM:SS

  // Emisor
  org_nit: string;
  org_nrc: string;
  org_name: string;
  establishment_type: string; // '01', '02', '04', '07', '20'
  org_phone: string;
  org_email: string;
  mh_establishment?: string | null;
  establishment: string;
  mh_sale_point?: string | null;
  sale_point: string;

  // Documento a anular
  relatted_sale_type: string; // '01', '03', '04', etc.
  relatted_sale_generation_code: string;
  relatted_sale_reception_stamp: string;
  relatted_sale_dte_number: string;
  relatted_sale_date: string; // formato fecha YYYY-MM-DD
  relatted_sale_iva_amount: number | null;
  relatted_sale_client_document_type: string | null; // '36', '13', '02', etc.
  relatted_sale_client_document_number: string | null;
  relatted_sale_client_name: string;
  relatted_sale_client_phone?: string | null;
  relatted_sale_client_email: string;

  // Motivo
  motivation_code: number; // 1, 2, 3
  motivation_description?: string | null;
  responsible_agent_name: string;
  responsible_agent_document_type: string;
  responsible_agent_document_number: string;
  solicitor_name: string;
  solicitor_document_type: string;
  solicitor_document_number: string;
}

export interface FXXguestDTO {
  // Extras de integración
  sale_id: number;
  token: string;

  // Identificación
  factu_version: number;
  environment: string; // '00' | '01'
  sale_type: string;
  dte_formatted: string;
  generationCode: string;
  dateSale: string; // YYYY-MM-DD
  hourSale: string; // HH:MM:SS

  // Emisor
  org_nit: string;
  org_nrc: string;
  org_name: string;
  economyActivity_num: string;
  economyActivity_name: string;
  org_comercial_name: string;
  establishment_type: string;
  establishment_department_code: string;
  establishment_municipallity_code: string;
  establishment_address: string;
  org_phone: string;
  org_email: string;
  mh_establishment: string;
  establishment: string;
  mh_sale_point: string;
  sale_point: string;
  item_export_type: number;
  fiscal_recinct: string;
  tax_regime: string;

  // Receptor
  client_name: string;
  client_doc_type: string;
  client_identity_code: string;
  client_commercial_name?: string | null;
  client_country_code: string;
  client_country_name: string;
  client_address_complement: string;
  client_type: string;
  client_economic_activity_name?: string | null;
  client_phone_number: string;
  client_email: string;

  // Otros documentos
  otrosDocumentos?: {
    codDocAsociado: number;
    descDocumento: string;
    detalleDocumento: string;
    modoTransp?: string | null;
    placaTrans?: string | null;
    numConductor?: string | null;
    nombreConductor?: string | null;
  }[];

  // Cuerpo del documento
  cuerpoDocumento?: {
    numItem: number;
    cantidad: number;
    codigo: string;
    uniMedida: number;
    descripcion: string;
    precioUni: number;
    montoDescu: number;
    ventaGravada: number;
    tributos: string[];
    noGravado: number;
  }[];

  // Resumen
  totalGravada: number;
  descuento: number;
  porcentajeDescuento: number;
  totalDescu: number;
  seguro: number;
  flete: number;
  montoTotalOperacion: number;
  totalNoGravado: number;
  totalPagar: number;
  totalLetras: string;
  condicionOperacion: number;

  pagos?: {
    codigo: string;
    montoPago: number;
    referencia: string;
    plazo?: string | null;
    periodo?: string | null;
  }[];

  codIncoterms: string;
  descIncoterms: string;
  numPagoElectronico: string;
  observaciones: string;

  // Apéndice
  apendice?: {
    campo: string;
    etiqueta: string;
    valor: string;
  }[];
}

export interface sujExcluidoDTO {
  // Extras de integración
  sale_id: number;
  token: string;

  // Identificación
  factu_version: number;
  environment: string; // '00' | '01'
  sale_type: string;
  dte_formatted: string;
  generationCode: string;
  dateSale: string; // YYYY-MM-DD
  hourSale: string; // HH:MM:SS

  // Emisor
  org_nit: string;
  org_nrc: string;
  org_name: string;
  economyActivity_num: string;
  economyActivity_name: string;
  org_comercial_name?: string;
  establishment_type?: string;
  establishment_department_code?: string;
  establishment_municipallity_code?: string;
  establishment_address: string;
  org_phone?: string;
  org_email?: string;
  mh_establishment?: string;
  establishment?: string;
  mh_sale_point?: string;
  sale_point?: string;

  // Sujeto Excluido / Receptor
  client_name: string;
  client_doc_type: string;
  client_identity_code: string;
  client_commercial_name?: string | null;
  client_country_code?: string;
  client_country_name?: string;
  client_address_complement: string;
  client_address_department?: string;
  client_address_municipallity?: string;
  client_type?: string;
  client_economic_activity_num?: string | null;
  client_economic_activity_name?: string | null;
  client_phone_number?: string;
  client_email?: string;

  // Cuerpo del documento
  sale_details: {
    numItem: number;
    item_type: string;
    quantity: number;
    internal_sale_code: string;
    measure_unit_code?: string;
    measure_unit_name?: string;
    unit_price: number;
    discount_amount: number;
    amount: number;
  }[];

  // Resumen
  totalCompra: number;
  descuento: number;
  totalDescu: number;
  subTotal: number;
  ivaRete1?: number;
  reteRenta?: number;
  totalPagar: number;
  totalLetras: string;
  condicionOperacion?: string;

  pagos?: {
    codigo: string;
    montoPago: number;
    referencia: string;
    plazo?: string | null;
    periodo?: string | null;
  }[];

  observaciones?: string;

  // Apéndice
  apendice?: {
    campo: string;
    etiqueta: string;
    valor: string;
  }[];
}
