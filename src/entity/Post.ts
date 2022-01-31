import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { MediaRec } from "./Media";
import { User } from "./User";

@Entity()
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;
    
    @Column()
    extract: string;
    
    @Column()
    text: string;
    
    @Column()
    slug: string;
    
    @Column()
    expires_at: Date;
    
    @Column()
    html_content: string;
    
    @OneToOne(() => MediaRec, {eager: true, nullable: true})
    @JoinColumn()
    poster_image: MediaRec;

    @ManyToOne(() => User, {eager: true})
    author: User;
}