const express = require("express");
const router = express.Router();
const tsController = require("../controllers/tsController");

router.get("/alive", tsController.alive);
router.post("/updates", tsController.updateTs);

module.exports = router;