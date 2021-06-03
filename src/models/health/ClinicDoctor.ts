import { format, parse } from "date-fns";
import { Column, Entity, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Clinic, Doctor, AttendingDay, Line } from ".";

@Entity({ name: "clinic_doctors" })
export class ClinicDoctor {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({ type: "time", nullable: true })
  avgAttendingTime!:string|null;

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

  public setAvgAttendingTime(startTimeAttending:Date):void {
    const currentDate = new Date(Date.now());
    const attendingDuration = format(currentDate.getTime() - startTimeAttending.getTime(), "HH:mm:ss");

    if (this.avgAttendingTime) {
      const avgAttendingTimeMili = parse(this.avgAttendingTime, "HH:mm:ss", currentDate).getTime();
      const attendingDurationMili = parse(attendingDuration, "HH:mm:ss", currentDate).getTime();
      this.avgAttendingTime = format((attendingDurationMili + avgAttendingTimeMili) / 2, "HH:mm:ss");
    } else {
      this.avgAttendingTime = attendingDuration;
    }
  }
}
