/* eslint-disable no-unused-vars */
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Line, Patient } from ".";

// eslint-disable-next-line no-shadow
enum Status{
  ONHOLD,
  DONE,
  INPROGRESS

}

@Entity({ name: "line_patients" })
export class LinePatient {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({ type: "time" })
  waitingTime!:string;

  @Column({
    type: "time",
    nullable: true
  })
  attendingDuration!:string;

  @Column({
    type: "enum",
    enum: Status
  })
  status!:Status;

  @ManyToOne(() => Line, line => line.linePatients)
  line!:Line;

  @ManyToOne(() => Patient)
  patient!:Patient

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
