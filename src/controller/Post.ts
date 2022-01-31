import { Request, Response, Application } from "express";
import { Post } from "../entity/Post";
import { IInitializable } from "../interface/IInitializable";
import { IRestHandler } from "../interface/IRestHandler";
import * as formidable from 'formidable';
import PersistentFile = require("formidable/PersistentFile");
import { MediaManager } from "../manager/Media";
import { PostManager } from "../manager/Post";
import { AuthManager } from "../manager/AuthManager";
import { User } from "../entity/User";
import { ConnectionManager } from "../manager/Connection";

import Ajv from 'ajv';
const addFormats = require("ajv-formats")



export class PostController implements IRestHandler<Post>, IInitializable {
    private _app: Application;
    private static _instance: PostController;

    public static get instance() {
        this._instance = this._instance ? this._instance : new PostController();
        return this._instance;
    }

    constructor(){
        this.getFields = this.getFields.bind(this);
        this.handlePost = this.handlePost.bind(this);
    }

    async initialize(app: Application) {
        this._app = app;
        try {
            this._app.post("/post", this.handlePost);
            this._app.post("/vote/post/:post_id", this.handlePostVote);
            this._app.put("/post", this.handlePut);
            this._app.get("/post", this.handleGet);
            this._app.delete("/post", this.handleDelete);
        } catch (e) {
            console.log({ e });
            return false;
        }
        return true;
    }

    async handlePostVote(request: Request, response: Response) {
        if(!request.headers['authorization']){
            return response.status(401).json({
                cause: "Unauthorized: missing header token (authorization)."
            })
        }

        const authorization = request.headers['authorization'];
        const firebase_profile = await AuthManager.instance.getFirebaseProfile(authorization.split(" ").pop())
        if(!firebase_profile){
            return response.status(401).json({
                cause: "Unauthorized (profile not found)."
            })
        }

        if(request.body.action && request.body.action === 'UP'){
            try{
                const updated = await PostManager.instance.voteUp(request.params['post_id'], firebase_profile.email);
                return response.status(200).json({
                    data: updated
                })
            }catch(e){
                return response.status(500).json({
                    cause: "Internal Error"
                });
            }
        }
        return response.status(200).send("WIP");
    }

    async getFields(request:Request){
        return new Promise((accept)=>{
            const form = formidable({ multiples: true });
            form.parse(request, (err, fields, files) => {
                if (err) {
                    accept(null);
                }
                accept({
                    fields, files
                })
            })
        })
    }

    async handlePost(request: Request, response: Response) {

        const data:{
            files: {
                media: PersistentFile
            },
            fields: {
                html_content: string, title: string
            }
        } = <any> await this.getFields(request);

        if(!data){
            return response.status(500).json({
                cause: "Invalid payload provided."
            })
        }

        if(!request.headers['authorization']){
            return response.status(401).json({
                cause: "Unauthorized: missing header token (authorization)."
            })
        }

        const authorization = request.headers['authorization'];
        const firebase_profile = await AuthManager.instance.getFirebaseProfile(authorization.split(" ").pop())
        if(!firebase_profile){
            return response.status(401).json({
                cause: "Unauthorized (profile not found)."
            })
        }

        const ajv = new Ajv()
        addFormats(ajv);
        ajv.addFormat("html_content", /^.{5,8000}$/);
        ajv.addFormat("title", /^.{5,50}$/);

        let valid = ajv.validate({
            type: 'object',
            properties: {
                html_content: {
                    type: "string",
                    format: "html_content"
                },
                title: {
                    type: "string",
                    format: "title"
                }
            }
        }, data.fields)
        if(!valid){
            return response.status(400).json({
                cause: "Invalid payload provided."
            })
        }

        const user_repo = ConnectionManager.instance.connection.getRepository(User);
        let local_profile = (await user_repo.find({
            where: {
                email: firebase_profile.email
            }
        }))[0]
        if(!local_profile){
            //We create the profile.
            local_profile = user_repo.create();
            local_profile.email = firebase_profile.email;
            local_profile.slug = firebase_profile.email.split("@")[0]+"_"+(Math.floor(Math.random() * 1e5));
            await user_repo.save(local_profile);
        }

        //We upload the media.
        const post_media = data.files.media ? await MediaManager.instance.saveMedia(data.files.media) : null;


        //We create the post.
        const postResult = await PostManager.instance.createPost(data.fields, local_profile, post_media);

        return response.status(200).json({
            result: postResult
        })
    }

    async handlePut(request: Request, response: Response) {
        return response.status(200).send("WIP");
    }

    async handleGet(request: Request, response: Response) {
        
        if(request.query){
            const collection = request.query['collection'];  //Base query on this data.
            //Get all.
            const all = await ConnectionManager.instance.connection.getRepository(Post).find();
            return response.status(200).send({
                data: all
            });
        }else{
            //Get all.
            const all = await ConnectionManager.instance.connection.getRepository(Post).find();
            return response.status(200).send({
                data: all
            });
        }
    }

    async handleDelete(request: Request, response: Response) {
        return response.status(200).send("WIP");
    }
}