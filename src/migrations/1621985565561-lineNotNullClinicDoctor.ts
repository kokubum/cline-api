import {MigrationInterface, QueryRunner} from "typeorm";

export class lineNotNullClinicDoctor1621985565561 implements MigrationInterface {
    name = 'lineNotNullClinicDoctor1621985565561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lines" DROP CONSTRAINT "FK_4aca1662e844615bbf205a75160"`);
        await queryRunner.query(`ALTER TABLE "lines" ALTER COLUMN "clinic_doctor_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lines" ADD CONSTRAINT "FK_4aca1662e844615bbf205a75160" FOREIGN KEY ("clinic_doctor_id") REFERENCES "clinic_doctors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "lines" DROP CONSTRAINT "FK_4aca1662e844615bbf205a75160"`);
        await queryRunner.query(`ALTER TABLE "lines" ALTER COLUMN "clinic_doctor_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "lines" ADD CONSTRAINT "FK_4aca1662e844615bbf205a75160" FOREIGN KEY ("clinic_doctor_id") REFERENCES "clinic_doctors"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
