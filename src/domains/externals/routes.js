const express = require("express");
const controller = require("./controller");

const router = express.Router();

router.get("/index", controller.index);
router.get("/getZipCoordenates", controller.coordinates_zip);
router.get("/getAddressCoordenates", controller.coordinates_address);
router.get("/banks", controller.banks);
module.exports = router;
