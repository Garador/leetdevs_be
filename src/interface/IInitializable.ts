import { Request, Response } from "express";

export interface IInitializable {
    initialize(data:any):Promise<any>;
}