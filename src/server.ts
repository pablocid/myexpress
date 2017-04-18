import { json as Json, urlencoded as Urlencoded } from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as errorHandler from "errorhandler";
import * as methodOverride from "method-override";

import { LandingRoute, UserRoute, DataPartialRoute } from './routes';

var dust = require('express-dustjs')

var conf = require('../config/enviroment');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;

    /**
     * Bootstrap the application.
     *
     * @class Server
     * @method bootstrap
     * @static
     * @return {ng.auto.IInjectorService} Returns the newly created injector for this app.
     */
    public static bootstrap(): Server {
        return new Server();
    }

    /**
     * Constructor.
     *
     * @class Server
     * @constructor
     */
    constructor() {

        //create expressjs application
        this.app = express();

        //configure application
        this.config();

        //add routes
        this.routes();

        //add api
        this.api();
    }

    /**
     * Create REST API routes
     *
     * @class Server
     * @method api
     */
    public api() {
        this.app.use('/api/partials', DataPartialRoute.route);
    }

    /**
     * Configure application
     *
     * @class Server
     * @method config
     */
    public config() {
        //add static paths
        this.app.use(express.static(path.join(__dirname, "../public")));

        //configure dust
        this.app.engine("dust", dust.engine({ useHelpers: true }))

        //configure pug
        this.app.set("views", path.join(__dirname, "../views"));

        this.app.set("view engine", "dust");

        //use logger middlware
        this.app.use(logger("dev"));

        //use json form parser middlware
        this.app.use(Json());

        //use query string parser middlware
        this.app.use(Urlencoded({ extended: true }));

        //use cookie parser middleware middlware
        this.app.use(cookieParser(conf.secrets.cookieParser));

        //use override middlware
        this.app.use(methodOverride());

        //catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());

        //CORS ???
        /*
        this.app.use(function (req: express.Request, res: express.Response, next: express.NextFunction) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            next();
        });
        */
    }

    /**
     *
     * @class Server
     * @method routes
     */
    public routes() {
        this.app.use('/', LandingRoute.route);
    }
}