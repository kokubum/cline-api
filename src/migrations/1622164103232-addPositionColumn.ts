import {MigrationInterface, QueryRunner} from "typeorm";

export class addPositionColumn1622164103232 implements MigrationInterface {
    name = 'addPositionColumn1622164103232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" ADD "position" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "line_patients" ADD CONSTRAINT "CHK_5933ceb2782adca90a3579bf3f" CHECK (position>0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "line_patients" DROP CONSTRAINT "CHK_5933ceb2782adca90a3579bf3f"`);
        await queryRunner.query(`ALTER TABLE "line_patients" DROP COLUMN "position"`);
    }

}
