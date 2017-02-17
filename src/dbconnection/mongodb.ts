import { Schema, Connection, createConnection, Model, Document, PromiseProvider, Promise } from "mongoose";


export class MongoConnection{
    public static STRING_CONNECTION: string = "mongodb://localhost:27017/myexpress";
    private _connection: Connection;
    public model: Model<Document>;

    constructor(name:string, schm:Schema){
        //use q promises
        global.Promise = require("q").Promise;

        //use q library for mongoose promise
        Promise = global.Promise;

        this._connection =  createConnection(MongoConnection.STRING_CONNECTION);
        this.model = this._connection.model(name, schm);

    }
}