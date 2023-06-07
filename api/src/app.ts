import express, { Express, NextFunction, Request, Response } from 'express';

import Routes from './routes/routes';
import cors from 'cors';
import { environment } from '../environments/environment';
import mongoose from 'mongoose';
import path from 'path';

class App {

  public express: Express;

  constructor() {
    this.express = express();
    this.middleware();
    this.configuration();
  }

  private middleware(): void {
    this.express.use(cors());
    this.express.use(express.json());
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use(environment.contextRoot, express.static(path.join(process.cwd(), environment.distFolder + '/src/static')));
    this.express.use(environment.contextRoot + '/uploads', express.static('./uploads'));

    const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(' ' + error);
      res.status(500).send('Error: ' + error);
    };

    this.express.use(errorHandler);
  }

  private async configuration(): Promise<void> {
    this.express.get('/', (req: Request, res: Response) => {
      console.log(req.originalUrl);
      if (environment.production) {
        res.sendFile('./' + environment.distFolder + '/src/static/index.html', { root: process.cwd() });
      }
    });

    const clientP: Promise<any> = mongoose.connect(environment.dbUrl, {
      dbName: environment.dbName,
      user: environment.dbUser,
      pass: environment.dbPassword,
      appName: environment.dbAppName,
      replicaSet: environment.dbReplicaSet,
      retryWrites: environment.dbRetryWrites as unknown as boolean,
      maxIdleTimeMS: environment.dbMaxIdleTimeMS as unknown as number,
      authSource: environment.dbAuthSource
    })
      .then(m => m.connection.getClient())
      .catch((err) => console.error(err));

    this.express.use(environment.contextRoot + '/api', Routes);

    this.express.use('*', (req: Request, res: Response, next: NextFunction) => {
      res.sendStatus(404);
    });
  }
}

export default new App().express;
