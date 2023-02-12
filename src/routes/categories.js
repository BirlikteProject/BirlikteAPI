const express = require('express');
const router = express.Router();

const validate = require("../middlewares/validate");
const schemas = require("../validations/category");

const { protect } = require('../middlewares/auth');
const { getCategories, addCategory } = require('../controllers/categories');

router.route('/').get(getCategories);
router.route('/').post(protect,validate(schemas.addCategoryValidation),addCategory);

module.exports = router;
