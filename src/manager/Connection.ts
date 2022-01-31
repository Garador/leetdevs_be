import { Connection, createConnection } from "typeorm";

export class ConnectionManager {
    private static _instance:ConnectionManager;
    
    private _connection:Connection;

    public static get instance(){
        this._instance = this._instance ? this._instance : new ConnectionManager();
        return this._instance;
    }

    public get connection(){
        return this._connection;
    }

    async initialize(){
        try{
            this._connection = await createConnection();
            console.log("Connection initialized correctly.");
        }catch(e){
            console.log({e});
            console.log("Error initializing connection.");
            return false;
        }
        return true;
    }
}