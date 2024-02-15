const Project = require("../models/Project"); 
const SalesOrder = require("../models/SalesOrder"); 
const mongoose = require('mongoose');


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
      task:data.task      
    });

    let taskTypes = ["mls", "mws", "aws", "mps", "mss", "mis", "mdds"];
    let totalManpowerCost = 0;
    let totalEquipmentCost = 0;
    let totalCost = 0;
    let totalCostArr = [];

    let costs = {};
    taskTypes.forEach(taskType => {
      costs[`${taskType}_mp_cost`] = 0;
      costs[`${taskType}_eq_cost`] = 0;
    });
    
    if (data.task) {
      data.task.forEach(taskType => {
        let typeCosts = { [taskType]: [] };
    
        taskTypes.forEach(type => {
          let mpCost = 0;
          let eqCost = 0;
    
          taskType[type]?.forEach(item => {
            item.man_power?.forEach(mp => {
              mpCost += mp.salary;
            });
            item.equipment?.forEach(eq => {
              eqCost += eq.cost;
            });
          });
    
          if (mpCost !== 0 || eqCost !== 0) {
            typeCosts[taskType].push({
              [`${type}_mp_cost`]: mpCost,
              [`${type}_eq_cost`]: eqCost,
            });
          }
    
          costs[`${type}_mp_cost`] += mpCost;
          costs[`${type}_eq_cost`] += eqCost;
          totalManpowerCost += costs[`${type}_mp_cost`];
          totalEquipmentCost += costs[`${type}_eq_cost`];
        });
        totalCostArr.push(typeCosts);
      });
    }
    
    totalCost= totalManpowerCost+totalEquipmentCost;
    
    // console.log("Total Cost Array:", JSON.stringify(totalCostArr, null, 2));
    // console.log("Total Manpower Cost:", totalManpowerCost);
    // console.log("Total Equipment Cost:", totalEquipmentCost);
    // console.log("Total Cost:", totalCost);
    
    let ordDetails = {
      p_id:project._id,
      issue_date:new Date(),
      name:data.title,
      order_number:random8DigitNumber(),
      order_id:project._id,
      items:itemRandomNumber(),
      task_cost:totalCostArr,
      total_manpower_cost:totalManpowerCost,
      total_equipment_cost:totalEquipmentCost, 
      total_cost:totalCost,     
      status:"Pending"
    }
    
    const cso = await createSaleOrder(ordDetails);
    console.log("cso worked",cso);
    res.status(200).json({ message: "Project created successfully", project,"OrderCreated":cso});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSaleOrder = async (productDetails) => {
  try {
    const data =productDetails;
    const salesorder =await SalesOrder.create({
      p_id:data.p_id,
      issue_date:data.issue_date,
      name:data.name,
      order_number:data.order_number,
      order_id:data.order_id,
      items:data.items,
      task_cost:data.task_cost,
      total_manpower_cost:data.total_manpower_cost,
      total_equipment_cost:data.total_equipment_cost,
      total_cost:data.total_cost,
      status:data.status
    });
    return true;
    // res.status(200).json({ message: "Project created successfully", salesorder});
  } catch (error) {
    console.log(error);
    return false;
    // res.status(500).json({ message: "Internal server error" });
  }
};


// Get all projects data
const getProjectById = async (req, res) => {
  try {
    // const allProjects = await Project.find()
    Project.aggregate([
      {
        $match: {
            _id: new mongoose.Types.ObjectId(req.body.id) 
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
              _id: 1 // Excluding _id field
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

const updateProjectbyId = async (req, res) => {
  const projectId = req.params.id;
  const data = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        title:data.title,
        assignee:data.assignee,
        reporter:data.reporter,
        location:data.location,
        priority:data.priority,
        description:data.description,
        start_date:data.start_date,
        end_date:data.end_date,
        status:data.status,
        task:data.task    
      },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  console.log("project id", projectId)

  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};


const random8DigitNumber=()=> {
  
  let randomNumber = Math.floor(Math.random() * 100000000);
  
  let randomString = randomNumber.toString();
  
  while (randomString.length < 8) {
    randomString = '0' + randomString;
  }
  return randomString;
}

const random7DigitNumber=()=> {
  
  let randomNumber = Math.floor(Math.random() * 100000000);
  
  let randomString = randomNumber.toString();
  
  while (randomString.length < 7) {
    randomString = '0' + randomString;
  }
  return randomString;
}

const itemRandomNumber=()=>{
  return Math.floor(Math.random() * (700 - 100 + 1)) + 100;
}


module.exports = {
  createProject,
  getProjectById,
  deleteProjectById,
  getAllProjectsList,
  updateProjectbyId
};