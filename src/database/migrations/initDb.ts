import { IConfig } from "src/config/interface";
import Logger from '../../utils/Logger';
const dotenv = require('dotenv');
dotenv.config();
import * as mysql2 from 'mysql2';
import * as fs from 'fs';
import * as path from 'path';



export function initializeDb(config: IConfig['db']): Promise<boolean> {
    return new Promise<boolean>((res, rej) => {
        try {
            Logger.log(config
        )
        // If you want to run migrations again please comment out the next two lines
            res(true); 
            return;
        const exists = fs.existsSync(path.join(__dirname, '.done'))
        if(exists) {
            Logger.log('Seed has ran before');
            
            res(true);
            return;

        }
        const data = fs.readFileSync(path.join(__dirname, 'base.sql'), 'utf-8');
        const connection = mysql2.createConnection({
            host: config.dbHost,
            user: config.user,
            port: parseInt(config.port),
            password: config.password,
            database: config.dbName,
            multipleStatements: true,
        });
        connection.connect();
        connection.query(data, [], (err) => {
            if(err) {
                rej(err);
                return;
            }
            Logger.log('Seed created successfully');
            
            connection.end();
            fs.writeFileSync(path.join(__dirname, '.done'), (new Date()).toDateString());
            res(true)
            
        });
    
    } catch(err) {
        rej(err);
    }
    })


}
