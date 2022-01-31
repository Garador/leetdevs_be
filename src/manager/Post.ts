import PersistentFile = require("formidable/PersistentFile");
import { getStorage, Storage } from 'firebase-admin/storage';
import { IPostCreationPayload, IPostItem } from "../interface/IPost";
import { ConnectionManager } from "./Connection";
import { Post } from "../entity/Post";
import { User } from "../entity/User";
import * as JSDOM from 'jsdom';
import { MediaRec } from "../entity/Media";
import { VOTING_POWER_SECONDS } from "../constants";

export class PostManager {
    private static _instance: PostManager;

    public static get instance(){
        this._instance = this._instance ? this._instance : new PostManager();
        return this._instance;
    }

    slugify(postTitle:string){
        return postTitle
            .replace(/\W{1,}/g, '-')
            .replace(/\s{1,}/g, '-')+"-"+Math.round((Math.random()*1e5));
    }

    async createPost(payload: IPostCreationPayload, author: User, media: MediaRec){
        try{
            let postRepo = ConnectionManager.instance.connection.getRepository(Post);
            let post = postRepo.create();
            
            post.title = payload.title;

            const post_text = JSDOM.JSDOM.fragment(payload.html_content).textContent.toString();
            
            post.extract = post_text.length > 400 ? post_text.substring(0, 400)+"..." : post_text.substring(0, 400);
            
            post.text = post_text;
            
            post.slug = this.slugify(post.title);
            
            post.expires_at = new Date((new Date().getTime())+((60*1000)*120));
            
            post.html_content = payload.html_content;
            
            post.author = author;
            
            if(media){
                post.poster_image = media;
            }

            await postRepo.save(post);

            return post;
        }catch(e){
            console.log({e});
            return null;
        }
    }

    async voteUp(postId:string, user_email: string){
        try{
            const postRepo = ConnectionManager.instance.connection.getRepository(Post);
            const postRecord = await postRepo.findOne(postId);
            if(!postRecord){
                return null;
            }
            let current_expiry = new Date(postRecord.expires_at);
            let next_expiry = new Date(current_expiry.getTime() + (VOTING_POWER_SECONDS * 1000))
            postRecord.expires_at = next_expiry;
            await postRepo.save(postRecord);
            return postRecord;
        }catch(voteUpError){
            console.log({voteUpError});
            return null;
        }
    }

}