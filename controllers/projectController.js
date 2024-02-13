const Project = require("../models/Project"); 

//Create project
const createProject = async (req, res) => {
  try {
    const data =req.body;
    const project =await Project.create({
      title:data.title,
      assignee:data.assignee,
      reporter:data.reporter,
      location:data.location,
      priority:data.priority,
      description:data.description,
      start_date:data.start_date,
      end_date:data.end_date,
      status:data.status,
      task:data.task,
      
    });
    res.status(200).json({ message: "Project created successfully", project });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all projects data
const getAllProjects = async (req, res) => {
  try {
    const allProjects = await Project.find()
    res.status(200).json(allProjects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createProject,
  getAllProjects
};