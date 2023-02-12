const Joi = require('joi');
const {
  SUPPORTER,
  DEMANDER,
} = require('../config/constants');

const phoneRegex = /^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
const tcknRegex = /^[1-9]{1}[0-9]{9}[02468]{1}$/
// 9eBtUxsBsUhq0G5qn0azag==
const updateProfileValidation = Joi.object({
fullName: Joi.string().min(3).max(100),
phone: Joi.string().regex(phoneRegex),
tckn:Joi.string().regex(tcknRegex),
about: Joi.string().allow(''),
username: Joi.string().min(3).max(30),
image_url: Joi.string().uri().allow(''),
type: Joi.string().valid(DEMANDER, SUPPORTER).messages({ 'any.only': '"\type" must be one of [supporter,demander]' })
});

module.exports = {

  updateProfileValidation,
};
