import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { LinePatient } from ".";

@Entity({ name: "lines" })
export class Line {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({
    default: false,
  })
  active!:boolean;

  @OneToMany(() => LinePatient, linePatient => linePatient.line)
  linePatients!:LinePatient[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
