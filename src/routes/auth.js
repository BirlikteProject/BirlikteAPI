const express = require('express');
const router = express.Router();


const validate = require("../middlewares/validate");
const schemas = require("../validations/auth");

const {firebaseVerify} = require("../middlewares/auth");
const {signIn,signUp} = require("../controllers/auth");

router.route("/login").post(firebaseVerify,validate(schemas.loginValidation),signIn);
router.route("/register").post(firebaseVerify,validate(schemas.registerValidation),signUp);



module.exports=router;