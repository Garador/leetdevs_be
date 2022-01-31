import { Request, Response } from "express";

export interface IRestHandler<T> {
    handlePost(request:Request, response: Response):Promise<any>;
    handlePut(request:Request, response: Response): Promise<any>;
    handleGet(request:Request, response: Response): Promise<any>;
    handleDelete(request:Request, response: Response): Promise<any>;
}


export interface IRestAuthenticator<T> {
    signIn(request:Request, response:Response):Promise<any>;
    signUp(request:Request, response:Response):Promise<any>;
    refreshToken(request:Request, response:Response):Promise<any>;
}