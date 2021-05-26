import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ClinicDoctor, WeekDay } from ".";

@Entity({ name: "attending_days" })
export class AttendingDay {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({ type: "time" })
  start!:string;

  @Column({ type: "time" })
  end!:string;

  @Column()
  onDuty!:boolean;

  @ManyToOne(() => WeekDay, { eager: true })
  weekDay!:WeekDay;

  @ManyToOne(() => ClinicDoctor, clinicDoctor => clinicDoctor.attendingDays, {
    onDelete: "CASCADE"
  })
  clinicDoctor!:ClinicDoctor;
}
