import { BaseRoute } from '../../models/class.route'
import { NextFunction, Request, Response, Router } from 'express';
import { FileSysConnection } from '../../dataconnection/filesys';
import * as Passport from 'passport';

import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';
import { sign as Sign, SignOptions } from 'jsonwebtoken';

const _ = require('lodash');
const conf = require('../../../config/enviroment');

export class AuthService extends BaseRoute {
    /**
     * Create the routes.
     *
     * @class DataPartialRoute
     * @method route
     * @static
     */
    public static get route() {
        let r = Router();
        var obj = new AuthService();

        r.get("/", (req: Request, res: Response, next: NextFunction) => {
            obj.index(req, res, next);
        });

        r.post('/login', (req: Request, res: Response, next: NextFunction) => {
            obj.login(req, res, next);
        });

        r.post('/session-login', Passport.authenticate('local'), (req: Request, res: Response) => {
            res.json({ message: "ok", req: req.user, isAut: req.isAuthenticated() });
        });

         r.get("/logout", (req: Request, res: Response, next: NextFunction) => {
            let bef = req.isAuthenticated();
            req.logout();
            res.json({message:'Succesfully logout', isAuth:req.isAuthenticated(), isBefore:bef})
        });

        return r;
    }

    public users: any[];

    /**
     * Constructor
     *
     * @class DataPartialRoute
     * @constructor
     */

    constructor() {
        super();

        this.users = [
            {
                id: 1,
                name: 'jonathanmh',
                password: '%2yx4'
            },
            {
                id: 2,
                name: 'test',
                password: 'test'
            }
        ];
    }

    /**
     *
     * @class DataPartialRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public index(req: Request, res: Response, next: NextFunction) {
        //lista de los routes disponibles
        res.json({ lista: [1, 2, 3, 4, 5] });
    }

    /**
     *
     * @class DataPartialRoute
     * @method index
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public login(req: Request, res: Response, next: NextFunction) {
        //lista de los routes disponibles
        if (req.body.name && req.body.password) {
            var name = req.body.name;
            var password = req.body.password;
        } else {
            res.status(401).json({ message: 'no name or password set', isAuth: req.isAuthenticated() });
            return;
        }
        // usually this would be a database call:
        var user = this.users[_.findIndex(this.users, { name: name })];
        if (!user) {
            res.status(401).json({ message: "no such user found" });
            return;
        }

        if (user.password === req.body.password) {
            // from now on we'll identify the user by the id and the id is the only personalized value that goes into our token
            var payload = { id: user.id, role: 'admin' };
            let signOpts: SignOptions = {};
            signOpts.expiresIn = '3h';
            var token = Sign(payload, conf.secrets.app, signOpts);
            res.json({ message: "ok", token: token, isAuth: req.isAuthenticated() });
            return;
        } else {
            res.status(401).json({ message: "passwords did not match", isAuth: req.isAuthenticated() });
            return;
        }
    }


    /**
     *
     * @class DataPartialRoute
     * @method partial
     * @param req {Request} The express Request object.
     * @param res {Response} The express Response object.
     * @next {NextFunction} Execute the next method.
     */
    public partial(req: Request, res: Response, next: NextFunction) {

    }

    private _isAuthenticated(req: Request, res: Response, next: NextFunction) {
        if (req.isAuthenticated())
            return next();
        res.redirect('/noauth');
    }

}