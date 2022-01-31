import { Request, Response, Application } from "express";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import { IInitializable } from "../interface/IInitializable";
import { IRestAuthenticator, IRestHandler } from "../interface/IRestHandler";

export class UserController implements IRestHandler<User>, IRestAuthenticator<Post>, IInitializable  {
    private _app:Application;
    private static _instance:UserController;

    public static get instance(){
        this._instance = this._instance ? this._instance : new UserController();
        return this._instance;
    }

    async initialize(app:Application){
        this._app = app;
        try{
            this._app.post("/auth/sign-in", this.signIn);
            this._app.post("/auth/sign-up", this.signUp);
            this._app.get("/auth/token", this.refreshToken);

            this._app.post("/user", this.handlePost);
            this._app.get("/user", this.handleGet);
            this._app.put("/user", this.handlePut);
            this._app.delete("/user", this.handleDelete);
        }catch(e){
            return false;
        }
        return true;
    }

    
    async signIn(request:Request, response:Response){
        return response.status(200).json({
            status: "WIP"
        })
    }
    async signUp(request:Request, response:Response){
        return response.status(200).json({
            status: "WIP"
        })
    }
    async refreshToken(request:Request, response:Response){
        return response.status(200).json({
            status: "WIP"
        })
    }


    async handlePost(request:Request, response: Response) {
        return response.status(200).json({
            status: "WIP"
        })
    }
    async handlePut(request:Request, response: Response) {
        return response.status(200).json({
            status: "WIP"
        })
    }
    async handleGet(request:Request, response: Response) {
        return response.status(200).json({
            status: "WIP"
        })
    }
    async handleDelete(request:Request, response: Response) {
        return response.status(200).json({
            status: "WIP"
        })
    }
}