import {MigrationInterface, QueryRunner} from "typeorm";

export class attendingDaysPopulate1621955958319 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const weekDays = await queryRunner.query(`SELECT * FROM week_days`);
        const allClinicDoctors = await queryRunner.query(`SELECT * FROM clinic_doctors`);
       
        for(let clinicDoctor of allClinicDoctors){
            for(let weekDay of weekDays){
                await queryRunner.query(`INSERT INTO attending_days ("clinic_doctor_id","week_day_id","start","end","on_duty") VALUES ('${clinicDoctor.id}','${weekDay.id}','09:00','16:00',false)`);
            }
        }
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DELETE FROM attending_days`);
    }

}
