import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../categories/entities/category.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { BaseEntity } from '../../common/entities/base.entity';

@Entity()
export class Question extends BaseEntity {
  @Column()
  title: string;

  @Column()
  content: string;

  @ManyToOne(() => Category, category => category.questions)
  category: Category;

  @ManyToMany(() => Tag, tag => tag.questions)
  @JoinTable()
  tags: Tag[];
}
