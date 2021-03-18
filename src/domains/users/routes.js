const express = require("express");
const controller = require("./controller");
const jwtAuth = require("../../middlewares/jwtAuth");

const router = express.Router();

router.post("/", controller.register);

router.get("/", [jwtAuth], controller.list);
router.get("/:id", [jwtAuth], controller.list_id);

router.put("/:id", [jwtAuth], controller.change);

router.delete("/:id", [jwtAuth], controller.exclude);

router.put("/deactivate/:id", [jwtAuth], controller.deactivate);
router.put("/activate/:id", [jwtAuth], controller.activate);

router.put("/change_password/:id", [jwtAuth], controller.change_password);
router.post('/ask_reset_pwd', controller.ask_reset_pwd);
router.get('/ask_reset_pwd/:hash', controller.reset_pwd);

module.exports = router;
