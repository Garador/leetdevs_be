import * as path from 'path';
import { initializeApp, cert, App } from 'firebase-admin/app';
const serviceAccount = require(path.resolve('./credentials/leetdevs-practice-firebase-adminsdk-s3fq1-923fa67634.json'));



export class FirebaseManager {

    private static _instance: FirebaseManager;
    private _app: App;

    public static get instance(){
        this._instance = this._instance ? this._instance : new FirebaseManager();
        return this._instance;
    }

    initialize(){
        this._app = initializeApp({
            credential: cert(serviceAccount),
            storageBucket: 'leetdevs-practice.appspot.com'
        });
        console.log("Firebase admin initialized correctly...");
    }

    get app(){
        return this._app;
    }

    
}