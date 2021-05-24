import {MigrationInterface, QueryRunner} from "typeorm";

export class manyToOneAttending1621869676581 implements MigrationInterface {
    name = 'manyToOneAttending1621869676581'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attending_days" DROP CONSTRAINT "FK_dc988447a466ec70b081c2f1cd5"`);
        await queryRunner.query(`ALTER TABLE "attending_days" DROP CONSTRAINT "REL_dc988447a466ec70b081c2f1cd"`);
        await queryRunner.query(`ALTER TABLE "clinics" ADD CONSTRAINT "UQ_aee0d917cd4ef597017790712cd" UNIQUE ("address")`);
        await queryRunner.query(`ALTER TABLE "attending_days" ADD CONSTRAINT "FK_dc988447a466ec70b081c2f1cd5" FOREIGN KEY ("week_day_id") REFERENCES "week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attending_days" DROP CONSTRAINT "FK_dc988447a466ec70b081c2f1cd5"`);
        await queryRunner.query(`ALTER TABLE "clinics" DROP CONSTRAINT "UQ_aee0d917cd4ef597017790712cd"`);
        await queryRunner.query(`ALTER TABLE "attending_days" ADD CONSTRAINT "REL_dc988447a466ec70b081c2f1cd" UNIQUE ("week_day_id")`);
        await queryRunner.query(`ALTER TABLE "attending_days" ADD CONSTRAINT "FK_dc988447a466ec70b081c2f1cd5" FOREIGN KEY ("week_day_id") REFERENCES "week_days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
