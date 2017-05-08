import { json as Json, urlencoded as Urlencoded } from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as errorHandler from "errorhandler";
import * as methodOverride from "method-override";
import * as Session from 'express-session';
import { LandingRoute, UserRoute, DataPartialRoute } from './routes';
import * as CORS from 'cors';
import * as Passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { UserController } from './routes/users/controller';

import { AuthService, PassportConf } from './routes/auth';

import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';
import { sign as Sign, SignOptions } from 'jsonwebtoken';

import * as mongoose from 'mongoose';
import * as ConnectMongo from 'connect-mongo';
const MongoStore = ConnectMongo(Session);

const _ = require('lodash');
const dust = require('express-dustjs')
const conf = require('../config/enviroment');

/**
 * The server.
 *
 * @class Server
 */
export class Server {

    public app: express.Application;
    public users: any[];
    public jwtOpts: StrategyOptions;
    private _strategy: JWTStrategy;

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
        var isAuthenticated = function (req: express.Request, res: express.Response, next: express.NextFunction) {
            if (req.isAuthenticated())
                return next();
            res.redirect('/noauth');
        }
        this.app.use('/api/partials', isAuthenticated, DataPartialRoute.route);
        this.app.use('/api/auth', AuthService.route);
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

        //configure session
        const optMC: ConnectMongo.MongoUrlOptions = { url: process.env.MONGODB_LOCAL };

        this.app.use(Session({
            secret: conf.secrets.session,
            resave: false,
            saveUninitialized: false,
            store: new MongoStore(optMC)
        }));  
        
        // PassportJs Configuration
        this.app.use(Passport.initialize());

        // setting JWT strategy
        PassportConf.JWTconf(Passport);

        // setting Local strategy
        PassportConf.LocalConf(Passport);
        this.app.use(Passport.session());


        //catch 404 and forward to error handler
        this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
            err.status = 404;
            next(err);
        });

        //error handling
        this.app.use(errorHandler());

        //CORS ???
        //this.app.use(CORS())
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
        var self = this;
        var isAuthenticated = function (req: express.Request, res: express.Response, next: express.NextFunction) {
            if (req.isAuthenticated())
                return next();
            //res.redirect('/noauth');
            res.json({ message: 'No esas autenticado' })
        }
        this.app.use('/', LandingRoute.route);
/*
        this.app.post('/local-login', Passport.authenticate('local'), (req: express.Request, res: express.Response) => {
            res.json({ message: "ok", req: req.user, isAut: req.isAuthenticated() });
        });
*/
        this.app.get('/noauth', (req: express.Request, res: express.Response) => {
            res.json({ message: 'No estas logeado' })
        });

        this.app.get('/private', (req: express.Request, res: express.Response) => {
            res.json({ message: 'Estas logeado' })
        });

        this.app.get("/secret", Passport.authenticate('jwt', { session: false }), function (req, res) {
            res.json({ message: "Success! You can not see this without a token", authInfo: req.user, auth: req.isAuthenticated() });
        });

        this.app.get("/local-secret", isAuthenticated, (req: express.Request, res: express.Response) => {
            res.json({ message: "Success! You can not see this without an auth", authInfo: req.user, isAuth: req.isAuthenticated(), d: req.connection.localPort });
        });


    }
}