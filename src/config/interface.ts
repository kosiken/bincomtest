

export interface IConfig {
    serverPort: string;
    env: string;
    version: string;
    db: {
        user: string;
        port: string;
        dbName: string;
        dbHost: string;
        password: string;
    },

  
}