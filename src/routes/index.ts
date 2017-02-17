import { NextFunction, Request, Response, Router } from "express";
import { BaseRoute } from "./route";
import { TopBar } from "../models/topbar";


import mongoose = require("mongoose"); //import mongoose
//import { Model, Connection, PromiseProvider, createConnection } from "mongoose";

//interfaces
import { IUser } from "../interfaces/user"; //import IUser

//models
import { IModel } from "../models/model"; //import IModel
import { IUserModel } from "../models/user"; //import IUserModel

//schemas
import { userSchema } from "../schemas/userSchm"; //import userSchema

import { Promise as QPromise } from "q";


import { UserController } from '../models/user';

import { MySQLConnection } from '../dbconnection/mysql'

/**
 * / route
 *
 * @class User
 */
export class IndexRoute extends BaseRoute {
    public user: mongoose.Model<IUserModel>;
    /**
     * Create the routes.
     *
     * @class IndexRoute
     * @method create
     * @static
     */
    public static create(router: Router) {
        //log
        //console.log("[IndexRoute::create] Creating index route.");

        //add home page route
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            new IndexRoute().index(req, res, next);
        });
    }

    /**
     * Constructor
     *
     * @class IndexRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * The home page route.
     *
     * @class IndexRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public index(req: Request, res: Response, next: NextFunction) {
        //set custom title
        this.title = "Home | MyExpress";
        var tb = new TopBar();
        var userCtrl = new UserController();
        var self = this;

        var my = new MySQLConnection();

        async function ASYNC() {
            try {
                var u1 = await userCtrl.users;
                var u2 = await userCtrl.getUser("58a5bba26e292e4b1cb6585a");
                var u3 = await userCtrl.getUserByFirstName("First03");
                var u4 = await my.getUsers();

                let model: Object = {
                    "message": "Welcome to My Express",
                    topBar: tb,
                    user: [u1[0].firstName, u2.firstName, u3.firstName, u4[1].firstName],
                    pepe: "pepesdasfdasdfp"
                };

                //render template
                self.render(req, res, "pages/index", model);
            } catch (e) {
                console.error(e.message);
            }

        }

        ASYNC();




    }
}