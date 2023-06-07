"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = require("./user.route");
class Routes {
    express;
    constructor() {
        this.express = (0, express_1.default)();
        this.routes();
    }
    routes() {
        const userRoute = new user_route_1.UserRoute();
        this.express.use(this.logRequest);
        this.express.use('/users', userRoute.router);
    }
    logRequest = (req, res, next) => {
        console.log('Received request:', req.method, req.url);
        next();
    };
}
exports.default = new Routes().express;
//# sourceMappingURL=routes.js.map