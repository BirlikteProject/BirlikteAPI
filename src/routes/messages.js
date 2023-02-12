const express = require('express');
const router = express.Router();

const validate = require("../middlewares/validate");
const schemas = require("../validations/messages");

const {protect} = require("../middlewares/auth");
const idChecker = require("../middlewares/idChecker");

const {sendMessage,getMessages} = require("../controllers/messages");

router.route("/:id").post(idChecker(),validate(schemas.sendMessageValidation),protect,sendMessage)
router.route("/:id").get(idChecker(),protect,getMessages)

module.exports=router;