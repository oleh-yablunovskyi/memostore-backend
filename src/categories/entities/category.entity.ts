import { Entity, Column, OneToMany } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column()
  name: string;

  @OneToMany(() => Question, question => question.category)
  questions: Question[];
}
