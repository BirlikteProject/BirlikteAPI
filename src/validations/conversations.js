const Joi = require('joi');



const createConversationValidation = Joi.object({
  receiver_id: Joi.string().alphanum().length(24).required(),
  advert_id: Joi.string().alphanum().length(24).required(),
});

module.exports = {

  createConversationValidation,
};
