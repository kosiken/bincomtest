import { IConfig } from '../config/interface'
import logger from '../utils/Logger';
import knex, { Knex } from 'knex';
import * as path from 'path'
import {initializeDb} from './migrations/initDb'
import Logger from '../utils/Logger';

export class Database {

  public static getInstance(): Database {
    return Database.instance;
  }

  private static instance: Database = new Database();
  public db?: Knex;
  private isSet: boolean;
  constructor() {
    if (Database.instance) {
      logger.logLevel.err('Error: Instantiation failed: Use Database.getInstance() instead of new.');
    }

    this.isSet = false;

    Database.instance = this;
  }

  public async setupDb(config: IConfig) {

    this.db = knex(
        {
            client: 'mysql2',
            connection: {host : config.db.dbHost,
            port : parseInt(config.db.port, 10),
            user : config.db.user,
            password :  config.db.password,
            database : config.db.dbName
        }
        }
    )
      
     
    const m = await initializeDb(config.db);
    Logger.log('migrations ' + m);
    this.isSet = true;


  }

  public async closeDb() {
    if(this.isSet) {
        this.db!.destroy();
      }
  }

}
