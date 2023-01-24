require('dotenv').config();
import {appConfig} from './config';

import { AppServer } from './app-server';
import * as base from './routes';

import Logger from './utils/Logger';

const app = new AppServer({
    controllers: [base]
}, appConfig.default)

app.Server()?.on('close', () => {
    app.closeDb();
})
app.startUpServer()
.then(() => {

    Logger.log(`listening on port ${app.port}`)


})
.catch(err => {
    console.error(err);
    console.log('tea')
})

