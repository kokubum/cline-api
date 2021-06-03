import {MigrationInterface, QueryRunner} from "typeorm";

export class changeNameToTotalWaitingTime1622494409959 implements MigrationInterface {
    name = 'changeNameToTotalWaitingTime1622494409959'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" RENAME COLUMN "attending_duration" TO "total_waiting_time"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" RENAME COLUMN "total_waiting_time" TO "attending_duration"`);
    }

}
