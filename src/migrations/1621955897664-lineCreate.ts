import {MigrationInterface, QueryRunner} from "typeorm";

export class lineCreate1621955897664 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const allClinicDoctors = await queryRunner.query(`SELECT * FROM clinic_doctors`);

        for (let clinicDoctor of allClinicDoctors){
            await queryRunner.query(`INSERT INTO lines (active,clinic_doctor_id) VALUES (false,'${clinicDoctor.id}')`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM lines`);
    }

}
