const Joi = require('joi');
const {
  PENDING,
  SUPPORTER,
  DEMANDER,
  ONLINE,
  FACETOFACE,
  ACCEPTED,
  REJECTED,
} = require('../config/constants');

const addAdvertValidation = Joi.object({
  category_id: Joi.string().alphanum().length(24).required(),
  postingType: Joi.string()
    .valid(ONLINE, FACETOFACE)
    .required()
    .messages({
      'any.only': '"postingType" must be one of [online,facetoface]',
    }),
  city_id: Joi.string().alphanum().length(24).required(),
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(3).max(1000).required(),
  // ! arkaplan
  image_url: Joi.string().uri(),
  type: Joi.string()
    .valid(SUPPORTER, DEMANDER)
    .messages({ 'any.only': '"\type" must be one of [supporter,demander]' }).required(),
  user_id: Joi.string().alphanum().length(24),
  isApproved: Joi.string()
    .valid(PENDING, ACCEPTED, REJECTED)
    .default(PENDING)
    .messages({
      'any.only': '"isApproved" must be one of [pending,accepted,rejected]',
    }),
  isDeleted: Joi.boolean().default(false),
});

const updateAdvertValidation = Joi.object({
  title: Joi.string().min(3).max(100),
  description: Joi.string().min(3).max(1000),
  category_id: Joi.string().alphanum().length(24),
  type: Joi.string()
    .valid(SUPPORTER, DEMANDER)
    .messages({ 'any.only': '"\type" must be one of [supporter,demander]' }),
  postingType: Joi.string()
    .valid(ONLINE, FACETOFACE)
    .messages({
      'any.only': '"postingType" must be one of [online,facetoface]',
    }),
  city_id: Joi.string().alphanum().length(24),
  //arkaplan
  image_url: Joi.string().uri(),
});

module.exports = {
  addAdvertValidation,
  updateAdvertValidation,
};
