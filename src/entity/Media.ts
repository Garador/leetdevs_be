import PersistentFile = require("formidable/PersistentFile");
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MediaRec {
    
    @PrimaryGeneratedColumn()
    id:number;

    @Column()
    location: string;

    @Column()
    url: string;

    @Column()
    alt: string;

    @Column()
    size: number;

}