import './preStart'; // Must be the first import
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import helmet from 'helmet';
import {createConnection} from "typeorm";
import express, { NextFunction, Request, Response } from 'express';
import StatusCodes from 'http-status-codes';
import 'express-async-errors';
var cors = require('cors')

import BaseRouter from './routes';
import log4js = require('log4js');
import fileUpload = require('express-fileupload');
import { getRepository } from "typeorm";
import { Options } from "../src/db/entities";

createConnection().then(async connection => {
    const logger = log4js.getLogger();

    const app = express();
    app.use(cors())
    const { BAD_REQUEST } = StatusCodes;

    const optionsRepository = getRepository(Options);
    const isHasGameVarInDB = await optionsRepository.find({name: 'isGameGoing'});
    if(!isHasGameVarInDB) {
        optionsRepository.save({name: 'isGameGoing', value: true});
    }

    app.use(function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        next();
      });

      app.use(fileUpload());

    /************************************************************************************
     *                              Set basic express settings
     ***********************************************************************************/

    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(cookieParser());

    // Show routes called in console during development
    if (process.env.NODE_ENV === 'development') {
        app.use(morgan('dev'));
    }

    // Security
    if (process.env.NODE_ENV === 'production') {
        app.use(helmet());
    }

    // Add APIs
    app.use('', BaseRouter);

    // Print API errors
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error(err, true);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    });

    // Start the server
    const port = Number(process.env.PORT || 4000);

    app.listen(port, () => {
        logger.info('Express server started on port: ' + port);
    });
})
