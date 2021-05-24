import {MigrationInterface, QueryRunner} from "typeorm";

export class addAddressColumn1621694303322 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE clinics ADD COLUMN address character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE clinics DROP COLUMN address`);
    }

}
