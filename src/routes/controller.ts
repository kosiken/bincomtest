

import { NextFunction, Request, response, Response } from "express";

import { AppError, ErrorType } from "../utils/AppErrors";
import Logger from "../utils/Logger";
import { Transaction } from "../database/models/dao";
import { Database } from "../database/db";
import { IAnnouncedPollingUnitResult } from "../database/models/AnnouncedPollingUnitResult";
import { IPollingUnit } from "../database/models/PollingUnit";


export async function getItems(req: Request, res: Response) {
  try {

    const paths = ['polling_unit', 'party', 'announced_pu_results', 'lga', 'ward'];
    const path = req.params.table;
    if(!paths.includes(path)) {
        return res.status(404).send('NOT FOUND');
    }

    let  {page: pageString, limit: limitString, ...others} = req.query
    let page = parseInt(pageString! as string) as number;
    let limit = 50;

    

    limitString = limitString as string;
    if (limitString) {
      limit = parseInt(limitString);
      if (isNaN(limit) || limit < 1) {
        Logger.logLevel.err("No valid limit parameter");
        // page = 1;
        limit = 50;
      }
    }
    if (isNaN(page) || page < 1) {
      Logger.logLevel.err("No valid page parameter");
      page = 1;
    }

    const dao = new Transaction(Database.getInstance());

    const results = await dao.findAll(others || {}, path, page, limit);
    return res.status(201).json({
      status: 'success',
      message: 'get_all_' + path,
      data: results,
    });
  } catch (err) {
    if ((err as any).errorType) {
      let error = err as AppError;
      if ((error.errorType = ErrorType.EXISTS)) {
        return res.status(400).json({
          message: error.message,
          data: {},
          status: 'error',
        });
      }
    }

    return res.status(500).json({
      message: (err as any).message || "An error occurred",
      data: (err as any).data,
      status: 'error',
    });
  }
}

export async function getResultsForPollingUnit(req: Request, res: Response) {
    try {
        const dao = new Transaction(Database.getInstance());
        const results = await dao.findAll({
            polling_unit_uniqueid: req.params['uniqueid']
        }, 'announced_pu_results', 1, 10000);
     
        return res.status(201).json({
            status: 'success',
            message: 'announced_polling_unit_result',
            data: results,
          });


    } catch (err) {
        if ((err as any).errorType) {
          let error = err as AppError;
          if ((error.errorType = ErrorType.EXISTS)) {
            return res.status(400).json({
              message: error.message,
              data: {},
              status: 'error',
            });
          }
        }
    
        return res.status(500).json({
          message: (err as any).message || "An error occurred",
          data: (err as any).data,
          status: 'error',
        });
      }
}


export async function fetchResultForLga(req: Request, res: Response) {
    try {
        function reducerFunction(a: {[x: string]: number}, b: IAnnouncedPollingUnitResult): {[x: string]: number} {
           
              return {
                ...a,
                [b.party_abbreviation]: !!a[b.party_abbreviation] ? a[b.party_abbreviation] + b.party_score : b.party_score,

              }
         
        }
        
        const dao = new Transaction(Database.getInstance());
        const results = await dao.resultForLga(parseInt(req.params['lgaId']))
        const lgas = await dao.findAll({}, 'lga', 1, 1000);
        console.log(results)
        return res.status(201).json({
            status: 'success',
            message: 'announced_polling_unit_result',
            data: {
              results: results.reduce(reducerFunction, {}),
              lgas: lgas.payload,
            
            },
          });
    }catch (err) {
        if ((err as any).errorType) {
          let error = err as AppError;
          if ((error.errorType = ErrorType.EXISTS)) {
            return res.status(400).json({
              message: error.message,
              data: {},
              status: 'error',
            });
          }
        }
    
        return res.status(500).json({
          message: (err as any).message || "An error occurred",
          data: (err as any).data,
          status: 'error',
        });
      }
}


export async function createPollingUnit(req: Request, res: Response) {
    try {
        const dao = new Transaction(Database.getInstance());
        const result = await dao.create<IPollingUnit>(req.body.pollingUnit, 'polling_unit', 'uniqueid');
        await dao.createMany(
            Object.keys(req.body.results).map(v => ({
                polling_unit_uniqueid: result['uniqueid'],
                party_abbreviation: v,
                party_score: req.body.results[v],
                entered_by_user: 'SYSTEM',
                date_entered: new Date(),
                user_ip_address: '100:29021'
            }))
        , 'announced_pu_results')
        return res.status(201).json({
            status: 'success',
            message: 'create_polling_unit',
            data: result
            
          });
    } catch (err) {
        if ((err as any).errorType) {
          let error = err as AppError;
          if ((error.errorType = ErrorType.EXISTS)) {
            return res.status(400).json({
              message: error.message,
              data: {},
              status: 'error',
            });
          }
        }
    
        return res.status(500).json({
          message: (err as any).message || "An error occurred",
          data: (err as any).data,
          status: 'error',
        });
      }
}