import express, { Express } from "express";

import { UserRoute } from "./user.route";

class Routes {

    public express: Express;

    constructor() {
        this.express = express();
        this.routes();
    }

    private routes(): void {
        const userRoute = new UserRoute();

        this.express.use(this.logRequest);
        this.express.use('/user', userRoute.router);
    }

    logRequest = (req: any, res: any, next: any) => {
        console.log('Received request:', req.method, req.url);
        next();
    };
}

export default new Routes().express;
