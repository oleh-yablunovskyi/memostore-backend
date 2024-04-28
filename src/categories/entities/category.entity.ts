import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToMany(() => Question, question => question.categories)
  questions: Question[];
}
