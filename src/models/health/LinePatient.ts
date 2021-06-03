/* eslint-disable no-unused-vars */
import { format } from "date-fns";
import { Check, Column, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Line, Patient } from ".";

// eslint-disable-next-line no-shadow
export enum Status{
  ONHOLD,
  DONE,
  INPROGRESS,
  DELETED
}

@Entity({ name: "line_patients" })
@Check("position>0")
export class LinePatient {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({
    type: "int"
  })
  position!:number;

  @Column({
    type: "time",
    nullable: true
  })
  waitingTime!:string|null;

  @Column({
    type: "time",
    nullable: true
  })
  totalWaitingTime!:string|null;

  @Column({
    type: "enum",
    enum: Status,
    default: Status.ONHOLD
  })
  status!:Status;

  @ManyToOne(() => Line, line => line.linePatients, {
    onDelete: "CASCADE"
  })
  line!:Line;

  @ManyToOne(() => Patient, {
    onDelete: "CASCADE",
    eager: true
  })
  patient!:Patient

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;

  public setTotalWaitingTime():void {
    const currentDate = new Date(Date.now());
    this.totalWaitingTime = format(currentDate.getTime() - this.createdAt.getTime(), "HH:mm:ss");
  }
}
