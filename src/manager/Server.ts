import * as Express from "express";
import { PostController } from "../controller/Post";
import { UserController } from "../controller/User";
import * as cors from 'cors'
import * as bodyParser from 'body-parser'

export class ServerManager {
    private static _instance:ServerManager;
    
    private _app:Express.Application;

    public static get instance(){
        this._instance = this._instance ? this._instance : new ServerManager();
        return this._instance;
    }

    public get connection(){
        return this._app;
    }

    async initialize(){
        try{
            this._app = Express();
            //this._app.use(Express.json())
            this._app.listen(process.env.PORT || 3000);
            this._app.use(cors());
            
            this._app.use(bodyParser.json());
            this._app.use(bodyParser.urlencoded());
            // in latest body-parser use like below.
            this._app.use(bodyParser.urlencoded({ extended: true }));


            console.log("Express App initialized correctly.")

            const _initialized_post = await PostController.instance.initialize(this._app);
            const _initialized_user = await UserController.instance.initialize(this._app);
            if(_initialized_post && _initialized_user){
                console.log("Controllers initialized correctly.");
            }
            return true;
        }catch(e){
            console.log({e});
            console.log("Error initializing the server.");
            return false;
        }
    }
}