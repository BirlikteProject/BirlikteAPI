const express = require("express");

const router = express.Router();

const validate = require("../middlewares/validate");
const schemas = require("../validations/profiles");

const {protect} = require("../middlewares/auth");
const idChecker = require("../middlewares/idChecker");

const {getProfile,updateProfile} = require("../controllers/profiles");


router.route("/").get(protect,getProfile)
router.route("/:id").get(idChecker(),protect,getProfile);
router.route("/").put(protect,validate(schemas.updateProfileValidation),updateProfile)

//profile için ayrı endpoint

module.exports=router;