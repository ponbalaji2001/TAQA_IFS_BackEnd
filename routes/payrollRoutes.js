const express = require("express");
const router = express.Router();
const tsController = require("../controllers/tsController");

router.get("/alive", tsController.alive);
router.post("/updates", tsController.updateTs);
router.post("/fetchtsbyid", tsController.getTs);
router.post("/updatetsstatus", tsController.updateTsStatus);
router.post("/updateexistdays", tsController.updateTsDays);
router.post("/mslreport", tsController.mslReport);
router.post("/dslreport", tsController.dslReport);

module.exports = router;