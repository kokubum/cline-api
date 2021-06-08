import {MigrationInterface, QueryRunner} from "typeorm";

export class updateTokensTable1623113154218 implements MigrationInterface {
    name = 'updateTokensTable1623113154218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "sessions" RENAME COLUMN "user_id" TO "patient_id"`);
        await queryRunner.query(`ALTER TABLE "tokens" RENAME COLUMN "user_id" TO "patient_id"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tokens" RENAME COLUMN "patient_id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "sessions" RENAME COLUMN "patient_id" TO "user_id"`);
    }

}
