-- CreateTable
CREATE TABLE "document_identity_types" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_identity_types_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "economic_activities" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "economic_activities_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clients" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clients_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "departments_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishment" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "establishment_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "establishment_type" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "establishment_type_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "municipalities" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "municipalities_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "measure_units" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "measure_units_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_points" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_points_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions_types" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solutions_types_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solutions_sales" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "solutions_sales_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_methods" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_methods_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_details" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_details_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sale_types" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sale_types_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credits" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credits_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pk" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sales" (
    "id" SERIAL NOT NULL,
    "created_at" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sales_pk" PRIMARY KEY ("id")
);
