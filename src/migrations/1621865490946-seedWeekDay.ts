import {MigrationInterface, QueryRunner} from "typeorm";

export class seedWeekDay1621865490946 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO week_days (name) VALUES ('Segunda-Feira'),('Terça-Feira'),('Quarta-Feira'),('Quinta-Feira'),('Sexta-Feira')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM week_days`);
    }

}
