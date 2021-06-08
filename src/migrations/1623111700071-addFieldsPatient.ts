import {MigrationInterface, QueryRunner} from "typeorm";

export class addFieldsPatient1623111700071 implements MigrationInterface {
    name = 'addFieldsPatient1623111700071'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "first_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "last_name" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "password" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "active" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "patients" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "patients" ADD "name" character varying NOT NULL`);
    }

}
