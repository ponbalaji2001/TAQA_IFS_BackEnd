const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const masterController = require("../controllers/masterController");


router.post("/user/create", userController.createUser);
router.post("/master/addemployee",masterController.createEmployee);
router.get("/master/alive",masterController.alive);
router.post("/master/addequipment",masterController.createEquipment);
router.post("/master/getemployeebyname",masterController.getEmployeeByName);
router.post("/master/getequipmentbyname",masterController.getEquipmentByName);


module.exports = router;