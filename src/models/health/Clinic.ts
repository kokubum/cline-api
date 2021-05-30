import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClinicDoctor } from ".";

@Entity({ name: "clinics" })
export class Clinic {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({
    unique: true
  })
  name!:string;

  @Column({
    unique: true
  })
  phone!:string;

  @Column({
    unique: true
  })
  address!:string;

  @OneToMany(() => ClinicDoctor, clinicDoctor => clinicDoctor.clinic)
  clinicDoctors!:ClinicDoctor[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
