import {getAuth} from 'firebase-admin/auth'

export class AuthManager {

    private static _instance:AuthManager;
    
    public static get instance(){
        this._instance = this._instance ? this._instance : new AuthManager();
        return this._instance;
    }

    async getFirebaseProfile(jwt: string){
        try{
            const result = await getAuth().verifyIdToken(jwt)
            return result;
        }catch(e){
            console.log({e});
            return null;
        }
    }
}