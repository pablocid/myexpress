import { BaseRoute } from '../../models/class.route'
import { NextFunction, Request, Response, Router } from "express";
import { TopBar } from "../../models/topbar";
import { UserController } from './controller';

export class UserRoute extends BaseRoute {
    /**
     * Create the routes.
     *
     * @class UserRoute
     * @method route
     * @static
     */
    public static get route() {
        let r = Router();
        r.get("/", (req: Request, res: Response, next: NextFunction) => {
            new UserRoute().index(req, res, next);
        });

        return r;
    }

    /**
     * Constructor
     *
     * @class UserRoute
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
        this.title = "Users | MyExpress";
        var tb = new TopBar();
        var userCtrl = new UserController();
        var self = this;

        async function ASYNC() {
            try {
                var u1 = await userCtrl.users;
                var u2 = await userCtrl.getUser("58a5bba26e292e4b1cb6585a");

                let model: Object = {
                    "message": "Welcome to Users",
                    topBar: tb,
                    user: [u1[0].firstName, u2.firstName],
                    pepe: "User Route"
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