import PersistentFile = require("formidable/PersistentFile");
import { getStorage, Storage } from 'firebase-admin/storage';
import { ConnectionManager } from "./Connection";
import { MediaRec } from "../entity/Media";

export class MediaManager {
    private static _instance: MediaManager;

    public static get instance(){
        this._instance = this._instance ? this._instance : new MediaManager();
        return this._instance;
    }

    async createMedia(data: {
        size: number,
        location: string,
        url: string,
        alt: string
    }){
        let mediaRepo = ConnectionManager.instance.connection.getRepository(MediaRec);
        let newRecord = mediaRepo.create();
        newRecord.alt = data.alt;
        newRecord.location = data.location;
        newRecord.size = data.size;
        newRecord.url = data.url;
        await mediaRepo.save(newRecord);
        return newRecord;
    }

    async saveMedia(file:PersistentFile){
        const result = await this.uploadFile(file);
        if(!result){
            throw new Error("Media was not saved correctly.");
        }
        const record = await this.createMedia(result);
        return record;
    }

    async uploadFile(file:PersistentFile){
        let data = file.toJSON();
        let store_filename = Math.round(Math.random() * 1e10).toString(32);
        let file_extension = data.originalFilename.split(".").pop();
        let new_filename = store_filename + "." + file_extension;
        const storage = getStorage();
        try{
            const result = await storage.bucket().upload(data.filepath,{
                destination: "/post_images/"+new_filename
            })
            let resultingData: {
                id: string //'leetdevs-practice.appspot.com//post_images/75gh542.png/1643592369658688',
                selfLink: string //'https://www.googleapis.com/storage/v1/b/leetdevs-practice.appspot.com/o/%2Fpost_images%2F75gh542.png',
                mediaLink: string //'https://storage.googleapis.com/download/storage/v1/b/leetdevs-practice.appspot.com/o/%2Fpost_images%2F75gh542.png?generation=1643592369658688&alt=media',
                name: string //'/post_images/75gh542.png',
                bucket: string //'leetdevs-practice.appspot.com',
                generation: string //'1643592369658688',
                metageneration: string //'1',
                contentType: string //'image/png',
                storageClass: string //'STANDARD',
                size: string //'363193',
                md5Hash: string //'7lIjfR9fg9huAAGLSIb/6w==',
                crc32c: string //'Dd4bcQ==',
                etag: string //'CMC25drq2vUCEAE=',
                timeCreated: string //'2022-01-31T01:26:09.661Z',
                updated: string //'2022-01-31T01:26:09.661Z',
                timeStorageClassUpdated: string //'2022-01-31T01:26:09.661Z'
            } = result.find(element => {
                return element.kind === 'storage#object';
            })
            const publicUrl = await storage.bucket().file(resultingData.name).getSignedUrl({
                action: 'read',
                expires: '03-09-2491'
            })
            return {
                size: parseInt(resultingData.size),
                location: resultingData.selfLink,
                url: publicUrl[0].toString(),
                alt: ""
            };
        }catch(e){
            console.log({e});
            return null;
        }
    }

}