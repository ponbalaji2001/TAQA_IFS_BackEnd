const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const masterController = require("../controllers/masterController");


router.post("/user/create", userController.createUser);
router.post("/master/addemployee",masterController.createEmployee);
router.get("/master/get/allemployees",masterController.getAllEmployees);
router.get("/master/get/avail/employees",masterController.getAvailEmployees);
router.get("/master/get/employee/:id",masterController.getEmployeeById);
router.post("/master/update/employee/:id",masterController.updateEmpbyId);
router.delete("/master/delete/employee/:id",masterController.deleteEmpById);
router.get("/master/alive",masterController.alive);
router.get("/master/getallequip",masterController.getAllEquip);
router.post("/master/addequipment",masterController.createEquipment);
router.post("/master/getemployeebyname",masterController.getEmployeeByName);
router.post("/master/getequipmentbyname",masterController.getEquipmentByName);
router.post("/master/updatemaster",masterController.updateMasterEquipment);
router.get("/master/get/all/supervisors", userController.getAllSupervisor);
router.get("/master/get/supervisor/:id", userController.getSupervisorById);
router.post("/master/get/supervisor/timesheetdata", userController.getSupervisorTimesheetSheet);
router.get("/master/get/all/admins", userController.getAllAdmin);
router.get("/master/get/all/users", userController.getAllUser);

// for materials
router.post("/master/addmaterials",masterController.createMaterials); 
router.get("/master/getall/materials", masterController.getAllMat);
router.post("/master/getmaterialbyname",masterController.getMatrialsByName);

module.exports = router;