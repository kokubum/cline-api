import { Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Clinic, Doctor, AttendingDay, Line } from ".";

@Entity({ name: "clinic_doctors" })
export class ClinicDoctor {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @ManyToOne(() => Clinic, clinic => clinic.clinicDoctors)
  clinic!:Clinic;

  @ManyToOne(() => Doctor, doctor => doctor.clinicDoctors)
  doctor!:Doctor;

  @OneToMany(() => AttendingDay, attendingDay => attendingDay.clinicDoctor)
  attendingDays!:AttendingDay[];

  @OneToOne(() => Line)
  @JoinColumn()
  line!:Line;
}
