import "reflect-metadata";
import { ConnectionManager } from "./manager/Connection";
import { FirebaseManager } from "./manager/Firebase";
import { ServerManager } from "./manager/Server";

Promise.all([
    ConnectionManager.instance.initialize(),
    ServerManager.instance.initialize(),
    FirebaseManager.instance.initialize()
])
.then(function(results){
})
.catch(function(err){
    console.log({err});
})