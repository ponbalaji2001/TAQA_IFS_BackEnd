const express = require("express");
const router = express.Router();
const tsController = require("../controllers/tsController");
const equipController = require("../controllers/eqipController");
const matController = require("../controllers/matController");


//for manpower ts
router.get("/alive", tsController.alive);
router.post("/updates", tsController.updateTs);
router.post("/fetchtsbyid", tsController.getTs);
router.post("/updatetsstatus", tsController.updateTsStatus);
router.post("/updateexistdays", tsController.updateTsDays);
router.post("/mslreport", tsController.mslReport);
router.post("/dslreport", tsController.dslReport);

//for equipment ts
router.get("/eq/alive", equipController.alive);
router.post("/eq/create", equipController.createTimeSheet);
router.post("/eq/update", equipController.updateTsDays);
router.post("/eq/fetchtsbyid", equipController.getEquipmentTs);
router.post("/eq/updateday", equipController.updateTsExistDays);
router.post("/eq/updatestatus", equipController.updateTsStatus);


//for equipment ts
router.get("/mat/alive", matController.alive);
router.post("/mat/create", matController.createTimeSheet);
router.post("/mat/update", matController.updateTsDays);
router.post("/mat/fetchtsbyid", matController.getMaterialTs);
router.post("/mat/updateday", matController.updateTsExistDays);
router.post("/mat/updatestatus", matController.updateTsStatus);

module.exports = router;