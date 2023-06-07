"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const routes_1 = __importDefault(require("./routes/routes"));
const environment_1 = require("../environments/environment");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
class App {
    express;
    constructor() {
        this.express = (0, express_1.default)();
        this.middleware();
        this.configuration();
    }
    middleware() {
        this.express.use(express_1.default.json());
        this.express.use(express_1.default.urlencoded({ extended: true }));
        this.express.use(environment_1.environment.contextRoot, express_1.default.static(path_1.default.join(process.cwd(), environment_1.environment.distFolder + '/src/static')));
        this.express.use(environment_1.environment.contextRoot + '/uploads', express_1.default.static('./uploads'));
        const errorHandler = (error, req, res, next) => {
            console.error(' ' + error);
            res.status(500).send('Error: ' + error);
        };
        this.express.use(errorHandler);
    }
    async configuration() {
        this.express.get('/', (req, res) => {
            console.log(req.originalUrl);
            if (environment_1.environment.production) {
                res.sendFile('./' + environment_1.environment.distFolder + '/src/static/index.html', { root: process.cwd() });
            }
        });
        const clientP = mongoose_1.default.connect(environment_1.environment.dbUrl, {
            dbName: environment_1.environment.dbName,
            user: environment_1.environment.dbUser,
            pass: environment_1.environment.dbPassword,
            appName: environment_1.environment.dbAppName,
            replicaSet: environment_1.environment.dbReplicaSet,
            retryWrites: environment_1.environment.dbRetryWrites,
            maxIdleTimeMS: environment_1.environment.dbMaxIdleTimeMS,
            authSource: environment_1.environment.dbAuthSource
        })
            .then(m => m.connection.getClient())
            .catch((err) => console.error(err));
        const halfDayInMilliseconds = 43200000;
        const store = connect_mongo_1.default.create({
            clientPromise: clientP,
            collectionName: 'sessions',
            dbName: environment_1.environment.dbName
        });
        this.express.use((0, express_session_1.default)({
            name: 'connect.sid',
            secret: environment_1.environment.secret,
            cookie: {
                secure: environment_1.environment.production,
                maxAge: halfDayInMilliseconds,
                sameSite: true
            },
            saveUninitialized: false,
            resave: true,
            store: store
        }));
        this.express.use((0, express_fileupload_1.default)());
        this.express.use(environment_1.environment.contextRoot + '/api', routes_1.default);
        this.express.use('*', (req, res, next) => {
            res.sendStatus(404);
        });
    }
}
exports.default = new App().express;
//# sourceMappingURL=app.js.map