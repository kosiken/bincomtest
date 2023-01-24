import { NextFunction, Request, Response } from 'express';
import logger from '../utils/Logger';
import { get } from 'lodash';

export function defaultValues(req: Request, res: Response, next: NextFunction) {
    res.locals.pageTitle = 'Polling Tests';
  next();
}
