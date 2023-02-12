const Joi = require('joi');


const addCategoryValidation = Joi.object({
  name:Joi.string().min(3).max(50).required(),
  image_url: Joi.string().uri().required()

});


module.exports = {
  addCategoryValidation
};
