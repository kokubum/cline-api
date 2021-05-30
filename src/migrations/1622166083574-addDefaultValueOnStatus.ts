import {MigrationInterface, QueryRunner} from "typeorm";

export class addDefaultValueOnStatus1622166083574 implements MigrationInterface {
    name = 'addDefaultValueOnStatus1622166083574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" ALTER COLUMN "status" DROP DEFAULT`);
    }

}
