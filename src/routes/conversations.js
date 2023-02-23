const express = require("express");

const router=express.Router();

const validate = require("../middlewares/validate");
const schemas = require("../validations/conversations");

const {protect} = require("../middlewares/auth");
const idChecker = require("../middlewares/idChecker");

const {createConversation,deleteConversation,getConversations,aggrementConversation} = require("../controllers/conversations");

router.route("/").post(protect,validate(schemas.createConversationValidation),createConversation);
router.route("/:id").delete(idChecker(),protect,deleteConversation);
router.route("/list/filter").get(protect,getConversations);
router.route("/:id").put(idChecker(),protect,validate(schemas.aggrementConversationValidation),aggrementConversation);

module.exports=router;