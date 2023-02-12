const Joi = require('joi');

const sendMessageValidation = Joi.object({
  message: Joi.string().max(365).required(),
});

module.exports = {
  sendMessageValidation,
};
