const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");
const SOController = require("../controllers/salesOrderController");
router.delete("/project/delete/:id", projectController.deleteProjectById);
router.post("/project/create", projectController.createProject);
router.patch("/project/update/:id", projectController.updateProjectbyId);
router.post("/project/getproductbyid", projectController.getProjectById);
router.get("/project/getallproductlist", projectController.getAllProjectsList);
router.get("/so/getsolist", SOController.getSOList);
router.post("/so/updatesostatus", SOController.editSODetails);
router.delete("/so/delete/:id", SOController.deleteSOById);
router.get("/so/get/:id", SOController.deleteSOById);
router.patch("/so/update/:id", SOController.updateSObyId);

module.exports = router;

