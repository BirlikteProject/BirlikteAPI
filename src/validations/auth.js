const Joi = require('joi');
const {DEMANDER,SUPPORTER} = require("../config/constants");

const firebaseTokenRegex =
  /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/;
  const tcknRegex = /^[1-9]{1}[0-9]{9}[02468]{1}$/
const loginValidation = Joi.object({
  firebase_token: Joi.string().regex(firebaseTokenRegex).required(),
});

const registerValidation = Joi.object({
  firebase_token: Joi.string().regex(firebaseTokenRegex).required(),
  type: Joi.string().valid(DEMANDER, SUPPORTER).required().messages({ 'any.only': '"\type" must be one of [supporter,demander]' }),
  tckn:Joi.string().regex(tcknRegex).required(),
  fullName:Joi.string().min(3).max(100),
  image_url: Joi.string().uri().allow(''),
});


module.exports = {
  loginValidation,
  registerValidation,
};
