import * as Joi from '@hapi/joi';

export default {
    createPollingUnit: Joi.object({
      pollingUnit: Joi.object({  polling_unit_id: Joi.number(),
        ward_id: Joi.number(),
        lga_id: Joi.number(),
        uniquewardid: Joi.number(),
        polling_unit_number: Joi.string().required(),
        polling_unit_name: Joi.string().required(),
        polling_unit_description: Joi.string().required(),
        lat: Joi.string().required(),
        long: Joi.string().required(),
      }),
      results: Joi.object({
        PDP: Joi.number(),
        DPP: Joi.number(),
        ACN: Joi.number(),
        PPA: Joi.number(),
        CDC:Joi.number(),
        JP: Joi.number()
      }).required()
 
  }),
};