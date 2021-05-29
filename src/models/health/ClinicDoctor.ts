import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Clinic, Doctor, AttendingDay, Line } from ".";

@Entity({ name: "clinic_doctors" })
export class ClinicDoctor {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({ type: "time", nullable: true })
  avgAttendingTime!:string;

  @ManyToOne(() => Clinic, clinic => clinic.clinicDoctors, {
    onDelete: "CASCADE"
  })
  clinic!:Clinic;

  @ManyToOne(() => Doctor, doctor => doctor.clinicDoctors, {
    onDelete: "CASCADE"
  })
  doctor!:Doctor;

  @OneToMany(() => AttendingDay, attendingDay => attendingDay.clinicDoctor)
  attendingDays!:AttendingDay[];

  @OneToOne(() => Line, line => line.clinicDoctor, { onDelete: "CASCADE" })
  line!:Line;
}
