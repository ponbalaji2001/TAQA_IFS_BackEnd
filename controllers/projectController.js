const Project = require("../models/Project"); 
const createSaleOrder = require("../controllers/salesOrderController");
const random8DigitNumber = require("../controllers/salesOrderController");
const random7DigitNumber = require("../controllers/salesOrderController");
const itemRandomNumber = require("../controllers/salesOrderController");

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
    let ordDetails = {
      name:data.title,
      order_number:random8DigitNumber(),
      order_id:random7DigitNumber(),
      items:itemRandomNumber,
      status:"Pending"
    }
    const cso = await createSaleOrder(ordDetails);
    res.status(200).json({ message: "Project created successfully", project,"OrderCreated":cso});
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

// Get all projects data
const getAllProjectsList = async (req, res) => {
  try {
    // const allProjects = await Project.find();
    Project.aggregate([
      {
          $project: {
              title: 1,
              assignee: 1,
              status: 1,
              start_date: 1,
              end_date: 1,
              _id: 0 // Excluding _id field
          }
      }
  ]).then(result => {
    console.log("fetched result",result.length);
    res.status(200).json(result);
  }).catch(err => {
      console.error(err);
  });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createProject,
  getAllProjects,
  getAllProjectsList
};