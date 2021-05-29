import {MigrationInterface, QueryRunner} from "typeorm";

export class addEnumValue1622326054445 implements MigrationInterface {
    name = 'addEnumValue1622326054445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "clinic_doctors" ADD "avg_attending_time" TIME`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "waiting_time" DROP NOT NULL`);
        await queryRunner.query(`ALTER TYPE "line_patients_status_enum" RENAME TO "line_patients_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "line_patients_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" TYPE "line_patients_status_enum" USING "status"::"text"::"line_patients_status_enum"`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "line_patients_status_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "line_patients_status_enum_old" AS ENUM('0', '1', '2')`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" TYPE "line_patients_status_enum_old" USING "status"::"text"::"line_patients_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" SET DEFAULT '0'`);
        await queryRunner.query(`DROP TYPE "line_patients_status_enum"`);
        await queryRunner.query(`ALTER TYPE "line_patients_status_enum_old" RENAME TO "line_patients_status_enum"`);
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "waiting_time" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "clinic_doctors" DROP COLUMN "avg_attending_time"`);
    }

}
