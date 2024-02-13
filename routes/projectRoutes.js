const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

router.post("/project/create", projectController.createProject);
router.get("/project/getall", projectController.getAllProjects);
router.get("/project/getallproductlist", projectController.getAllProjectsList);

module.exports = router;

