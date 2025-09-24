-- AlterTable
ALTER TABLE "clients" ADD COLUMN     "department_id" INTEGER,
ADD COLUMN     "document_identity_id" INTEGER,
ADD COLUMN     "economic_activity_id" INTEGER,
ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "identity_code" VARCHAR,
ADD COLUMN     "is_major_contributor" BOOLEAN,
ADD COLUMN     "municipality_id" INTEGER,
ADD COLUMN     "name" VARCHAR,
ADD COLUMN     "phone_number" VARCHAR,
ADD COLUMN     "street_1" TEXT,
ADD COLUMN     "street_2" TEXT;

-- AlterTable
ALTER TABLE "credits" ADD COLUMN     "establishment_id" INTEGER,
ADD COLUMN     "residue" REAL,
ADD COLUMN     "sale_id" INTEGER,
ADD COLUMN     "seattle" DATE,
ADD COLUMN     "sold_out" BOOLEAN;

-- AlterTable
ALTER TABLE "departments" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "document_identity_types" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "economic_activities" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" TEXT;

-- AlterTable
ALTER TABLE "establishment" ADD COLUMN     "department_id" INTEGER,
ADD COLUMN     "establishment_type_id" INTEGER,
ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "municipality_id" INTEGER,
ADD COLUMN     "street_1" TEXT,
ADD COLUMN     "street_2" TEXT;

-- AlterTable
ALTER TABLE "establishment_type" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "measure_units" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "municipalities" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "payment_methods" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "amount" REAL,
ADD COLUMN     "credit_id" INTEGER,
ADD COLUMN     "payment_method_id" INTEGER,
ADD COLUMN     "sale_id" INTEGER;

-- AlterTable
ALTER TABLE "sale_details" ADD COLUMN     "discount_amount" REAL,
ADD COLUMN     "excento_amount" REAL,
ADD COLUMN     "gravado_amount" REAL,
ADD COLUMN     "iva_total" REAL,
ADD COLUMN     "measure_unit_id" INTEGER,
ADD COLUMN     "no_suj_amount" REAL,
ADD COLUMN     "num_item" INTEGER,
ADD COLUMN     "quantity" REAL,
ADD COLUMN     "solution_id" VARCHAR,
ADD COLUMN     "solution_sale_id" INTEGER,
ADD COLUMN     "unit_price" REAL;

-- AlterTable
ALTER TABLE "sale_points" ADD COLUMN     "establishment_id" INTEGER,
ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "sale_types" ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "sales" ADD COLUMN     "client_id" INTEGER,
ADD COLUMN     "control_num_dte" VARCHAR,
ADD COLUMN     "discount_percentage" REAL,
ADD COLUMN     "discount_total" REAL,
ADD COLUMN     "generation_code" VARCHAR,
ADD COLUMN     "iva_total" REAL,
ADD COLUMN     "operation_condition" INTEGER,
ADD COLUMN     "reception_stamp" VARCHAR,
ADD COLUMN     "sale_point_id" INTEGER,
ADD COLUMN     "sale_type_id" INTEGER,
ADD COLUMN     "total_amount" REAL,
ADD COLUMN     "total_exento" REAL,
ADD COLUMN     "total_gravado" REAL,
ADD COLUMN     "total_letters" VARCHAR,
ADD COLUMN     "total_no_suj" REAL,
ADD COLUMN     "total_of_totals" REAL,
ADD COLUMN     "total_with_discount" REAL;

-- AlterTable
ALTER TABLE "solutions_sales" ADD COLUMN     "internal_code" VARCHAR,
ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR,
ADD COLUMN     "solution_type_id" INTEGER;

-- AlterTable
ALTER TABLE "solutions_types" ADD COLUMN     "column1" VARCHAR,
ADD COLUMN     "mh_code" VARCHAR,
ADD COLUMN     "name" VARCHAR;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_departments_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_document_identity_types_fk" FOREIGN KEY ("document_identity_id") REFERENCES "document_identity_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_economic_activities_fk" FOREIGN KEY ("economic_activity_id") REFERENCES "economic_activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "clients" ADD CONSTRAINT "clients_municipalities_fk" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_departments_fk" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_establishment_type_fk" FOREIGN KEY ("establishment_type_id") REFERENCES "establishment_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "establishment" ADD CONSTRAINT "establishment_municipalities_fk" FOREIGN KEY ("municipality_id") REFERENCES "municipalities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_points" ADD CONSTRAINT "sale_points_establishment_fk" FOREIGN KEY ("establishment_id") REFERENCES "establishment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "solutions_sales" ADD CONSTRAINT "solutions_sales_solutions_types_fk" FOREIGN KEY ("solution_type_id") REFERENCES "solutions_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_details" ADD CONSTRAINT "sale_details_measure_units_fk" FOREIGN KEY ("measure_unit_id") REFERENCES "measure_units"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sale_details" ADD CONSTRAINT "sale_details_solutions_sales_fk" FOREIGN KEY ("solution_sale_id") REFERENCES "solutions_sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_establishment_type_fk" FOREIGN KEY ("establishment_id") REFERENCES "establishment_type"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_sales_fk" FOREIGN KEY ("sale_id") REFERENCES "sales"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_clients_fk" FOREIGN KEY ("client_id") REFERENCES "clients"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_sale_points_fk" FOREIGN KEY ("sale_point_id") REFERENCES "sale_points"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sales" ADD CONSTRAINT "sales_sale_types_fk" FOREIGN KEY ("sale_type_id") REFERENCES "sale_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
