import { Database } from "../db";
import { v4 as uuid } from "uuid";
import { AppError, ErrorType } from "../../utils/AppErrors";
import { IAnnouncedPollingUnitResult } from "./AnnouncedPollingUnitResult";


export class Transaction {
  
    private database: Database

    constructor(db: Database) {
        this.database = db;
    }

    async create<T>(transactionObj: any, table: string, refColumn: string) {
       
    
        
        const query = await this.database
          .db!.insert(transactionObj, [refColumn])
          .into(table)
          .onConflict('reference')
          .ignore()
          
          
    
        if (!query || query[0] == 0) {
          throw new AppError(
            ErrorType.INTERNAL_ERROR,
            new Error("Failed to register transaction")
          );
        }

      
        return await this.getOne<T>({
          [refColumn]: query[0],
        }, table);
    
       
      }

      async createMany(data: any[], table: string) {
        const database = this.database;
        // console.log(data)
        const query = database.db!.batchInsert(table, data, 30)
        .returning(['result_id'])
        const ans = await query;
        console.log(ans);

      }

      async getOne<T>(columns: Record<string, any>, table: string) {
        const database = this.database;
        const query = database.db!(table)
          .where(columns)
          .first<T>();
        return (await query) as any as T;
      }
    
      async deleteAll(table: string) {
        const database = this.database;
        const query = database.db!(table).where({}).del();
        return (await query);
      }

      async findAll<T extends {}>(columns: Record<string, any>, table: string, page: number = 1, limit = 50) {
        const database = this.database;
        if(page < 0) {
            page = 1
        }
        const queryTotal = database.db!(table).where(columns).count({id: '*'})
        const total = (await queryTotal)[0].id as number;
     
        let payload: T[] = [];
        if(total > 0){
        const query = database.db!<T>(table)
        .where(columns)
        .limit(limit)
        .offset((page - 1) * limit)
        const result = await query;
        payload = result as T[];
}
        let rows =
        total >= limit ? Math.ceil(total / limit) : payload.length === 0 ? 0 : 1;

        
        
        
        return  {
            rows,
            page,
            size: payload.length,
            total,
            payload,
          };
      }

      async resultForLga(lga_id: number): Promise<IAnnouncedPollingUnitResult[]> {
        const database = this.database;
        const query = database.db!('lga')
        
        .rightJoin('polling_unit', 'lga.lga_id', 'polling_unit.lga_id')
        .rightJoin('announced_pu_results','polling_unit.uniqueid', '=', 'announced_pu_results.polling_unit_uniqueid')
        .select('announced_pu_results.*')
        .where('lga.lga_id', '=', lga_id);
        const result = await query;
        return result as IAnnouncedPollingUnitResult[];
      }
}