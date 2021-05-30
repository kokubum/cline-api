import {MigrationInterface, QueryRunner} from "typeorm";

export class healthTable1621955776981 implements MigrationInterface {
    name = 'healthTable1621955776981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attending_days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "start" TIME NOT NULL, "end" TIME NOT NULL, "on_duty" boolean NOT NULL, "week_day_id" uuid, "clinic_doctor_id" uuid, CONSTRAINT "PK_082f42a7e093f25772c1dcd4ada" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clinics" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "UQ_79dd2d4fc95a707b7248ebbeadb" UNIQUE ("name"), CONSTRAINT "UQ_605129134863dc6dfeeb41f21d2" UNIQUE ("phone"), CONSTRAINT "UQ_aee0d917cd4ef597017790712cd" UNIQUE ("address"), CONSTRAINT "PK_5513b659e4d12b01a8ab3956abc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "clinic_doctors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "clinic_id" uuid, "doctor_id" uuid, CONSTRAINT "PK_d771ad727b2e59c2adcbdc6eb6e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "doctors" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "document" character varying NOT NULL, "crm" character varying NOT NULL, "email" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "UQ_dca587e3b020b63e80735f4dcbf" UNIQUE ("document"), CONSTRAINT "UQ_d7e8212b37dd4e61e996d7289cd" UNIQUE ("crm"), CONSTRAINT "UQ_62069f52ebba471c91de5d59d61" UNIQUE ("email"), CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "lines" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "clinic_doctor_id" uuid, CONSTRAINT "REL_4aca1662e844615bbf205a7516" UNIQUE ("clinic_doctor_id"), CONSTRAINT "PK_155ad34738bc0e1aab0ca198dea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "line_patients_status_enum" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`CREATE TABLE "line_patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "waiting_time" TIME NOT NULL, "attending_duration" TIME, "status" "line_patients_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "line_id" uuid, "patient_id" uuid, CONSTRAINT "PK_9272ea62dc30968bece15839d80" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "patients" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "document" character varying NOT NULL, "email" character varying NOT NULL, "plan_number" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "UQ_9572d422e2410ec39fd86f63a87" UNIQUE ("document"), CONSTRAINT "UQ_64e2031265399f5690b0beba6a5" UNIQUE ("email"), CONSTRAINT "UQ_39d2d4d2f64387060437553c9c4" UNIQUE ("plan_number"), CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "week_days_name_enum" AS ENUM('Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado')`);
        await queryRunner.query(`CREATE TABLE "week_days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" "week_days_name_enum" NOT NULL, CONSTRAINT "PK_65fd7c01f43e4828d0401b9c349" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attending_days" ADD CONSTRAINT "FK_dc988447a466ec70b081c2f1cd5" FOREIGN KEY ("week_day_id") REFERENCES "week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attending_days" ADD CONSTRAINT "FK_18919228b047759d1eed06066de" FOREIGN KEY ("clinic_doctor_id") REFERENCES "clinic_doctors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic_doctors" ADD CONSTRAINT "FK_af1ae1e8059ba8e22e46aed77be" FOREIGN KEY ("clinic_id") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "clinic_doctors" ADD CONSTRAINT "FK_7fb1eaa359f4a7c45e2da6f8cf6" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "lines" ADD CONSTRAINT "FK_4aca1662e844615bbf205a75160" FOREIGN KEY ("clinic_doctor_id") REFERENCES "clinic_doctors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line_patients" ADD CONSTRAINT "FK_f10d8ca34279b59e8a38943a0a7" FOREIGN KEY ("line_id") REFERENCES "lines"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "line_patients" ADD CONSTRAINT "FK_7eba2646908cb264e098fbae846" FOREIGN KEY ("patient_id") REFERENCES "patients"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" DROP CONSTRAINT "FK_7eba2646908cb264e098fbae846"`);
        await queryRunner.query(`ALTER TABLE "line_patients" DROP CONSTRAINT "FK_f10d8ca34279b59e8a38943a0a7"`);
        await queryRunner.query(`ALTER TABLE "lines" DROP CONSTRAINT "FK_4aca1662e844615bbf205a75160"`);
        await queryRunner.query(`ALTER TABLE "clinic_doctors" DROP CONSTRAINT "FK_7fb1eaa359f4a7c45e2da6f8cf6"`);
        await queryRunner.query(`ALTER TABLE "clinic_doctors" DROP CONSTRAINT "FK_af1ae1e8059ba8e22e46aed77be"`);
        await queryRunner.query(`ALTER TABLE "attending_days" DROP CONSTRAINT "FK_18919228b047759d1eed06066de"`);
        await queryRunner.query(`ALTER TABLE "attending_days" DROP CONSTRAINT "FK_dc988447a466ec70b081c2f1cd5"`);
        await queryRunner.query(`DROP TABLE "week_days"`);
        await queryRunner.query(`DROP TYPE "week_days_name_enum"`);
        await queryRunner.query(`DROP TABLE "patients"`);
        await queryRunner.query(`DROP TABLE "line_patients"`);
        await queryRunner.query(`DROP TYPE "line_patients_status_enum"`);
        await queryRunner.query(`DROP TABLE "lines"`);
        await queryRunner.query(`DROP TABLE "doctors"`);
        await queryRunner.query(`DROP TABLE "clinic_doctors"`);
        await queryRunner.query(`DROP TABLE "clinics"`);
        await queryRunner.query(`DROP TABLE "attending_days"`);
    }

}
