import {Entity, PrimaryGeneratedColumn, Column, OneToMany} from "typeorm";
import { Post } from "./Post";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    slug: string;

    @OneToMany(() => Post, post => post.author)
    posts: Post[]
}
