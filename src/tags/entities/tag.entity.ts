import { Entity, Column, ManyToMany } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Tag extends BaseEntity {
  @Column()
  name: string;

  @ManyToMany(() => Question, question => question.tags)
  questions: Question[];
}
