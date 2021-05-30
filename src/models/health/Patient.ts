import { Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({ name: "patients" })
export class Patient {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column()
  name!:string;

  @Column({
    unique: true
  })
  document!:string;

  @Column({
    unique: true
  })
  email!:string;

  @Column({
    nullable: true,
    unique: true
  })
  planNumber!:string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
