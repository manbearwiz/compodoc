import * as crypto from 'node:crypto';
import { IsEmail, Validate } from 'class-validator';
import {
    BeforeInsert,
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn
} from 'typeorm';
import { ArticleEntity } from '../article/article.entity';

@Entity('user')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    @IsEmail()
    email: string;

    @Column({ default: '' })
    bio: string;

    @Column({ default: '' })
    image: string;

    @Column()
    password: string;

    @BeforeInsert()
    hashPassword() {
        this.password = crypto.createHmac('sha256', this.password).digest('hex');
    }

    @ManyToMany(type => ArticleEntity)
    @JoinTable()
    favorites: ArticleEntity[];

    @OneToMany(
        type => ArticleEntity,
        article => article.author
    )
    articles: ArticleEntity[];
}
