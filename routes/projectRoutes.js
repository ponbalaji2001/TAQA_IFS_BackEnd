const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const SOController = require("../controllers/salesOrderController");
router.post("/project/create", projectController.createProject);
router.get("/project/getall", projectController.getAllProjects);
router.get("/project/getallproductlist", projectController.getAllProjectsList);
router.get("/so/getsolist", SOController.getSOList);
router.post("/so/updatesostatus", SOController.editSODetails);

module.exports = router;

