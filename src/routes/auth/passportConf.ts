const conf = require('../../../config/enviroment');
import { ExtractJwt, Strategy as JWTStrategy, StrategyOptions } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';


export class PassportConf {

    public static JWTconf(P: any): void {
        let pass = new PassportConf();
        P.use(pass.jwtConfiguration());
    }

    public static LocalConf(P: any): void {
        let pass = new PassportConf();
        P.use(pass.localConfiguration());
        P.serializeUser(pass.serializeUser());
        P.deserializeUser(pass.deserializeUser());
    }




    constructor() { }

    public jwtConfiguration() {
        let jwtOpts = { jwtFromRequest: ExtractJwt.fromAuthHeader(), secretOrKey: conf.secrets.app };

        let jwtConf = new JWTStrategy(jwtOpts, (jwt_payload, next) => {
            console.log('payload received', jwt_payload);
            // usually this would be a database call:
            // or put payload info
            var user = jwt_payload;
            console.log('user', user)
            if (user) {
                next(null, user);
            } else {
                next(null, false);
            }
        });

        return jwtConf;
    }

    public localConfiguration() {
        let local = new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        }, (req, username, password, done) => {
            console.log(username, password)
            done(null, { _id: '123', password: 'pass', username: 'user' });

            // check in mongo if a user with username exists or not
            /*
            User.getUserByEmail(email)
                .then(user => {
                    //validate the password with, exempl: bcrypt-nodejs or bcryptjs
                    if (user && isValidPassword(password, user.password)) {
                        console.log('logeado')
                        done(null, user);
                    } else {
                        console.log('no logeado')
                        done(null, false)
                    }
                })
                .catch(err => done(err));
            */

        });

        return local;
    }

    // Serialize user
    public serializeUser() {
        return (user: any, done: any) => {
            console.log('serializeUser', user._id);
            done(null, user._id)
        }
    }

    //Deserialize user
    public deserializeUser() {
        return (id: string, done: any) => {
            console.log('deserializeUser: id: ' + id);
            done(null, { _id: '123', password: 'pass', username: 'user' })
            /*
            User.getUser(id)
                .then(user => {
                    console.log('asdf');
                    done(null, user)
                })
                .catch(err => {
                    console.log('8888asd');
                    done(err)
                });
            */

        }
    }

    public isValidPassword (candidate: string, password: string): boolean {
        //return bCrypt.compareSync(password, user.password);
        return true;
    }
}



