import { MigrationInterface, QueryRunner } from "typeorm";
import { RequestContext } from "../helpers/requestContext";

export class seedClinicDoctorsTable1621788077544 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('SELECT * FROM clinics')
        var allClinics = await RequestContext.getInstance().db.clinicRepository.getAll()
        
        var allDoctors = await RequestContext.getInstance().db.doctorRepository.getAll()
        
        var allLines = await RequestContext.getInstance().db.lineRepository.getAll()
        
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 3; j++) {
                await queryRunner.query(`INSERT INTO clinic_doctors (id, clinic_id, doctor_id, line_id) VALUES (uuid_generate_v4(), '${allClinics[i].id}', '${allDoctors[i*3 + j].id}', '${allLines[i*3 + j].id}')`)
            }
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DELETE FROM clinic_doctors')
    }

}
