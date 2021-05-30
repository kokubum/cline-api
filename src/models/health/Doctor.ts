import { Column, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { ClinicDoctor } from ".";

@Entity({ name: "doctors" })
export class Doctor {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column()
  name!:string;

  @Column({ unique: true })
  document!:string;

  @Column({ unique: true })
  crm!:string;

  @Column({ unique: true })
  email!:string;

  @OneToMany(() => ClinicDoctor, clinicDoctor => clinicDoctor.doctor)
  clinicDoctors!:ClinicDoctor[];

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
