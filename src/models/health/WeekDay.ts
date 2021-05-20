/* eslint-disable no-unused-vars */
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// eslint-disable-next-line no-shadow
enum WeekDayEnum{
  SEGUNDA = "Segunda-Feira",
  TERCA = "Terça-Feira",
  QUARTA = "Quarta-Feira",
  QUINTA = "Quinta-Feira",
  SEXTA = "Sexta-Feira"
}

@Entity({ name: "week_days" })
export class WeekDay {
  @PrimaryGeneratedColumn("uuid")
  id!:string;

  @Column({
    type: "enum",
    enum: WeekDayEnum
  })
  name!:WeekDayEnum;
}
