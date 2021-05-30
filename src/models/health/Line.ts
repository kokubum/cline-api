import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LinePatient } from ".";
import { ClinicDoctor } from "./ClinicDoctor";

@Entity({ name: "lines" })
export class Line {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({
    default: false,
  })
  active!:boolean;

  @OneToMany(() => LinePatient, linePatient => linePatient.line, { eager: true })
  linePatients!:LinePatient[];

  @OneToOne(() => ClinicDoctor, clinicDoctor => clinicDoctor.line, { onDelete: "CASCADE", nullable: false })
  @JoinColumn()
  clinicDoctor!:ClinicDoctor;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
