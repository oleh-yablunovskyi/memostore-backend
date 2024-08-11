import { Entity, Column, OneToMany, ManyToOne } from 'typeorm';
import { Question } from '../../questions/entities/question.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Category extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @OneToMany(() => Question, question => question.category)
  questions: Question[];

  @ManyToOne(() => Category, category => category.children)
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];
}
