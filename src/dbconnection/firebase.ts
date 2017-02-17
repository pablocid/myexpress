import { defer } from 'q';
import { initializeApp, database, credential } from "firebase-admin";

var serviceAccount = require("../../firekey.json");

initializeApp({
    credential: credential.cert(serviceAccount),
    databaseURL: "https://myexpress-88f9a.firebaseio.com"
});

export class FireConnection {
    public db: database.Database;
    private _init: any;
    constructor() {
        this.db = database();
    }

    getSome() {
        var def = defer();
        //var ref = this.db.ref("/someshit");
        //ref.set({ pepe: "pato" })

        this.db.ref('someshit/krap').set({
            crap:'popo',
            pi:'pichi'
        }).then(x=>{
            console.log(x);
            def.resolve(x)
        })
        /*
        ref.limitToFirst(1).on("child_added", function (snapshot: any) {
            def.resolve(JSON.stringify(snapshot.key()) );
            console.log(snapshot.val());
        });
        */

//        def.resolve('lsakjdflksjdl')
        return def.promise;

    }
}