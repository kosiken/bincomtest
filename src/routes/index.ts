import * as express from 'express';
import passport = require('passport');
import { createValidator } from 'express-joi-validation';
import { asyncHandler } from '../middlewares';
import * as controller from './controller';
import schema from './schema';



export function init(app: any) {
    const validator = createValidator({
        passError: true,
      });
  const router = express.Router();


  router.get('/get-items/:table',
  asyncHandler(controller.getItems),
  );

  router.get('/get-results-for-polling-unit/:uniqueid',
  asyncHandler(controller.getResultsForPollingUnit),
  );

  router.get('/get-results-for-lga/:lgaId',
  asyncHandler(controller.fetchResultForLga),
  );

  router.post('/create-polling-unit',
  validator.body(schema.createPollingUnit),
  asyncHandler(controller.createPollingUnit),
  )
  app.use('/', router);
}

