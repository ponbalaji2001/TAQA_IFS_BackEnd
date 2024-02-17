const Project = require("../models/Project"); 
const SalesOrder = require("../models/SalesOrder"); 
const EmployeeMaster = require("../models/employee"); 
const mongoose = require('mongoose');


//Create project
const createProject = async (req, res) => {
  try {
    const data =req.body;
    const project =await Project.create({
      title:data.title,
      pid:random7DigitNumber(),
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

    let totalManpowerCost = 0;
    let totalEquipmentCost = 0;
    let totalCost = 0;
    let tax=0;
    let allEquipments = [];
    let allManPower = [];

    if (data.task) {
      data.task.forEach(taskType => {
        Object.keys(taskType).forEach(type => {
          taskType[type]?.forEach(item => {

            item.man_power?.forEach(eq => {
              const manpowerDetails = {
                empid: eq.empid,
                empname: eq.empname,
                experience: eq.experience,
                designation: eq.designation,
                salary: eq.salary,
              };
               
              totalManpowerCost+=eq.salary;

              allManPower.push(manpowerDetails);
            });

            item.equipment?.forEach(eq => {
              const equipmentDetails = {
                equipmentid: eq.equipmentid,
                name: eq.name,
                quantity: eq.quantity,
                cost: eq.cost,
                specification: eq.specification,
              };

              allEmpIds.push(eq.empid);
              totalEquipmentCost += eq.quantity*eq.cost;
              allEquipments.push(equipmentDetails);
            });
          });
        });
      });
    }

    try {
      const filter = { empid: { $in: allEmpIds } };
      const update = {
          $push: {
              projects: {
                  project_id: project.pid,
                  project_location: project.location
              }
          }
      };
      
      const result = await collection.updateMany(filter, update);
      
      if (result) {
          console.log("Employee Project details updated successfully");
        }
      } catch (error) {
        console.log(error);
      }
  
    
    totalCost= totalManpowerCost+totalEquipmentCost;
    tax=0.1*totalCost;

    console.log(totalManpowerCost+" "+totalEquipmentCost+" "+totalCost);
    let ordDetails = {
      p_id:project.pid,
      issue_date:new Date(),
      due_date:project.end_date,
      project_location:project.location || " ",
      name:data.title,
      order_number:random8DigitNumber(),
      order_id:project._id,
      items:itemRandomNumber(),
      all_manpower:allManPower,
      all_equipment:allEquipments,
      total_manpower_cost:totalManpowerCost,
      total_equipment_cost:totalEquipmentCost, 
      total_cost:totalCost,  
      tax:tax,
      amount_due: totalCost+tax,   
      status:"Pending"
    }
    
    const cso = await createSaleOrder(ordDetails);
    console.log("cso worked",cso);
    res.status(200).json({ message: "Project created successfully", project, cso});
    
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
      due_date:data.due_date,
      project_location:data.project_location,
      name:data.name,
      order_number:data.order_number,
      order_id:data.order_id,
      items:data.items,
      all_manpower:data.all_manpower,
      all_equipment:data.all_equipment,
      total_manpower_cost:data.total_manpower_cost,
      total_equipment_cost:data.total_equipment_cost,
      total_cost:data.total_cost,
      tax:data.tax,
      amount_due:data.amount_due,
      status:data.status
    });
    return salesorder;
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
              pid:1,
              title: 1,
              assignee: 1,
              status: 1,
              start_date: 1,
              end_date: 1,
              location:1,
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
    let resultData={};
    try {
      const project =await Project.create({
        title:data.title,
        pid:random7DigitNumber(),
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
  
      let totalManpowerCost = 0;
      let totalEquipmentCost = 0;
      let totalCost = 0;
      let tax=0;
      let allEquipments = [];
      let allManPower = [];
      let allEmpIds=[];
  
      if (data.task) {
        data.task.forEach(taskType => {
          Object.keys(taskType).forEach(type => {
            taskType[type]?.forEach(item => {
  
              item.man_power?.forEach(eq => {
                const manpowerDetails = {
                  empid: eq.empid,
                  empname: eq.empname,
                  experience: eq.experience,
                  designation: eq.designation,
                  salary: eq.salary,
                };
                totalManpowerCost+=eq.salary;
                allManPower.push(manpowerDetails);
              });
  
              item.equipment?.forEach(eq => {
                const equipmentDetails = {
                  equipmentid: eq.equipmentid,
                  name: eq.name,
                  quantity: eq.quantity,
                  cost: eq.cost,
                  specification: eq.specification,
                };
  
                totalEquipmentCost += eq.quantity*eq.cost;
  
                allEquipments.push(equipmentDetails);
              });
            });
          });
        });
      }

      console.log(allEmpIds)
      
      totalCost= totalManpowerCost+totalEquipmentCost;
      tax=0.1*totalCost;
  
      console.log(totalManpowerCost+" "+totalEquipmentCost+" "+totalCost);
      let ordDetails = {
        p_id:project.pid,
        issue_date:new Date(),
        due_date:project.end_date,
        project_location:project.location || " ",
        name:data.title,
        order_number:random8DigitNumber(),
        order_id:project._id,
        items:itemRandomNumber(),
        all_manpower:allManPower,
        all_equipment:allEquipments,
        total_manpower_cost:totalManpowerCost,
        total_equipment_cost:totalEquipmentCost, 
        total_cost:totalCost,  
        tax:tax,
        amount_due: totalCost+tax,   
        status:"Pending"
      }
      
      const cso = await createSaleOrder(ordDetails);
      resultData["updatedProject"] = project;
      resultData["updatedSo"] = cso;
    } catch (error) {
      console.log(error);
    }

    try {
      const project = await Project.findByIdAndDelete(data._id);
      if (!project) {
        console.log("Project not found");
        resultData["oldProject"] = false;
      }else{
        resultData["oldProject"] = true;
        console.log("Project deleted successfully");
      }
    } catch (error) {
      console.log(error)
    }

    try {
      let d = { order_id: data._id };
      const project = await SalesOrder.deleteMany(d);
      if (!project) {
        resultData["oldSO"] = false;
        console.log("SO not found");
      }else{
        resultData["oldSO"] = true;
        console.log("Sales order deleted successfully");
      }      
    } catch (error) {
      console.log(error)
    }  
    console.log(resultData);
    res.status(200).json({ message: "Project updated successfully",data:resultData});
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

  try {
    let d = { order_id: projectId};
    const project = await SalesOrder.deleteMany(d);
    if (!project) {
      resultData["oldSO"] = false;
      console.log("SO not found");
    }else{
      resultData["oldSO"] = true;
      console.log("Sales order deleted successfully");
    }      
  } catch (error) {
    console.log(error)
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