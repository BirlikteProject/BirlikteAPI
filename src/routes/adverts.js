const express = require('express');

const router = express.Router();

const validate = require("../middlewares/validate");
const schemas = require("../validations/adverts");

const {protect} = require("../middlewares/auth")
const idChecker = require("../middlewares/idChecker");
const {addAdvert,getAdvert,getAdverts,updateAdvert,deleteAdvert,searchAdvert} = require("../controllers/adverts");

router.route("/").post(protect,validate(schemas.addAdvertValidation),addAdvert); // İlan Ekle
router.route("/:id").get(idChecker(),getAdvert); // herkes görüntüleyebilir.
router.route("/list/filter").get(getAdverts); // herkes görüntüleyebilir.
router.route("/:id").put(idChecker(),protect,validate(schemas.updateAdvertValidation),updateAdvert); 
router.route("/:id").delete(idChecker(),protect,deleteAdvert); 
router.route("/search/:city_id").get(idChecker("city_id"),searchAdvert); // herkes görüntüleyebilir.

module.exports=router;