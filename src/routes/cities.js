const express = require('express');

const router=express.Router();
const {getCities} = require("../controllers/cities");
router.route("/").get(getCities)
module.exports=router;