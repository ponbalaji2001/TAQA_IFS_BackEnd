const Project = require("../models/Project"); 
const SalesOrder = require("../models/SalesOrder"); 
const EmployeeMaster = require("../models/employee"); 
const mongoose = require('mongoose');
const TimeSheet = require("../models/timesheet"); 


//Create project
const createProject = async (req, res) => {
  try {
    const data =req.body;
    // const project =await Project.create({
    //   title:data.title,
    //   pid:random7DigitNumber(),
    //   assignee:data.assignee,
    //   reporter:data.reporter,
    //   location:data.location,
    //   priority:data.priority,
    //   description:data.description,
    //   start_date:data.start_date,
    //   end_date:data.end_date,
    //   status:data.status,
    //   phases:data.phases     
    // });

    let totalManpowerCost = 0;
    let totalEquipmentCost = 0;
    let totalCost = 0;
    let tax=0;
    let allEquipments = [];
    let allManPower = [];
    let allEmpIds=[];

    if (data.phases) {
      data.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          Object.keys(task).forEach(taskType => {
            const taskArray = task[taskType] || [];
    
            if (taskArray.length > 0) {
              taskArray.forEach(item => {
                (item.man_power || []).forEach(eq => {
                  const manpowerDetails = {
                    empid: eq.empid,
                    empname: eq.empname,
                    experience: eq.experience,
                    designation: eq.designation,
                    salary: eq.salary,
                    supervisor_id:eq.supid,
                    _id:eq._id,
                    phase_start:eq.phase_start,
                    phase_end:eq.phase_end
                  };
                  allEmpIds.push(eq.empid)
                  totalManpowerCost += eq.salary;
                  allManPower.push(manpowerDetails);
                });
    
                (item.equipment || []).forEach(eq => {
                  const equipmentDetails = {
                    equipmentid: eq.equipmentid,
                    name: eq.name,
                    quantity: eq.quantity,
                    cost: eq.cost,
                    specification: eq.specification,
                  };
    
                  totalEquipmentCost += eq.quantity * eq.cost;
    
                  allEquipments.push(equipmentDetails);
                });
              });
            }
          });
        });
      });
    }
    
    console.log("All Manpower:", allManPower);
    // console.log("All Equipments:", allEquipments);
    // console.log("Total Manpower Cost:", totalManpowerCost);
    // console.log("Total Equipment Cost:", totalEquipmentCost);
   
    // console.log(allEmpIds);

   

    
    // try {
      // const filter = { empid: { $in: allEmpIds } };
      // const update = {
      //     $push: {
      //         projects: {
      //             project_id: project.pid,
      //             project_location: project.location
      //         }
      //     }
      // };

      // const filter = { empid: { $in: allEmpIds } };
      // const update = {
      //     $push: {
      //         projects: {
      //             project_id: "project.pid",
      //             project_location: "project.location"
      //         }
      //     }
      // };
      // console.log('filter',filter);
      // console.log("update",update);
      // const result = await EmployeeMaster.updateMany(filter, update);
      
      // if (result) {
      //     console.log("Employee Project details updated successfully", result);
      //   }
      // } catch (error) {
      //   console.log(error);
      // }
      
       // const newTS =  await createTimeSheet(employee);
       let project = {
        _id:"65d7654a3560793b336331d5"
       }
       console.log("Projct Id:", project._id);
       let TsCreated = [];
       if(allManPower.length > 0){        
          allManPower.forEach(employee => {                    
            let sendData = {
              _id:employee._id,
              empid:employee.empid,
              supid:employee.supervisor_id,
              projectid:project._id,
              pro_start_date:employee.phase_start,  
              pro_end_date:employee.phase_end,   
            }
            // console.log("send data",sendData);
            const newTS = createTimeSheet(sendData);
            TsCreated.push(newTS);
          });
      }else{
        console.log("Emp Empty !.. Timesheet not created")
      }
    
    // totalCost= totalManpowerCost+totalEquipmentCost;
    // tax=0.1*totalCost;

    // console.log(totalManpowerCost+" "+totalEquipmentCost+" "+totalCost);
    // let ordDetails = {
    //   p_id:project.pid,
    //   issue_date:new Date(),
    //   due_date:project.end_date,
    //   project_location:project.location || " ",
    //   name:data.title,
    //   order_number:random8DigitNumber(),
    //   order_id:project._id,
    //   items:itemRandomNumber(),
    //   phases:project.phases,
    //   all_manpower:allManPower,
    //   all_equipment:allEquipments,
    //   total_manpower_cost:totalManpowerCost,
    //   total_equipment_cost:totalEquipmentCost, 
    //   total_cost:totalCost,  
    //   tax:tax,
    //   amount_due: totalCost+tax,   
    //   status:"Pending"
    // }
    
    // const cso = await createSaleOrder(ordDetails);
    // console.log("cso worked",cso);
    res.status(200).json({ 
      message: "Project created successfully",
      tsmsg:"TimeSheet created Successfully"
    });
    // res.status(200).json({ message: "Project created successfully", project, cso});
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createTimeSheet = async(details)=>{

  try{
    let data = details;  
    const newts = await TimeSheet.create({
        employee_id:data._id,
        empid:data.empid,
        current_supervisor_id:data.supid,
        current_project_id:data.projectid,
        current_phase_start_date:data.pro_start_date,  
        current_phase_end_date:data.pro_end_date,     
        timesheets:[],
        tsStatus:"active"
    });
    console.log("Timesheet created : ",newts);
    return true;
  }catch(err){
    console.log("While ts creating ",err);
    return false;
  }
}


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
      phases:data.phases,
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
        phases:data.phases     
      });
  
      let totalManpowerCost = 0;
      let totalEquipmentCost = 0;
      let totalCost = 0;
      let tax=0;
      let allEquipments = [];
      let allManPower = [];
      let allEmpIds=[];
  
      if (data.phases) {
        data.phases.forEach(phase => {
          phase.tasks.forEach(task => {
            Object.keys(task).forEach(taskType => {
              const taskArray = task[taskType] || [];
      
              if (taskArray.length > 0) {
                taskArray.forEach(item => {
                  (item.man_power || []).forEach(eq => {
                    const manpowerDetails = {
                      empid: eq.empid,
                      empname: eq.empname,
                      experience: eq.experience,
                      designation: eq.designation,
                      salary: eq.salary,
                    };
                    allEmpIds.push(eq.empid)
                    totalManpowerCost += eq.salary;
                    allManPower.push(manpowerDetails);
                  });
      
                  (item.equipment || []).forEach(eq => {
                    const equipmentDetails = {
                      equipmentid: eq.equipmentid,
                      name: eq.name,
                      quantity: eq.quantity,
                      cost: eq.cost,
                      specification: eq.specification,
                    };
      
                    totalEquipmentCost += eq.quantity * eq.cost;
      
                    allEquipments.push(equipmentDetails);
                  });
                });
              }
            });
          });
        });
      }
      // console.log("All Manpower:", allManPower);
      // console.log("All Equipments:", allEquipments);
      // console.log("Total Manpower Cost:", totalManpowerCost);
      // console.log("Total Equipment Cost:", totalEquipmentCost);
      

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
        phases:project.phases,
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
  let resultData={};
  const projectId = req.params.id;
  console.log("project id", projectId)

  try {
    const project = await Project.findByIdAndDelete(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // res.status(200).json({ message: "Project deleted successfully", project });

  } catch (error) {
    console.log(error)
    // res.status(500).json({ message: "Internal server error" });
  }

    

  try {
    let d = { order_id: projectId};
    const saleorder = await SalesOrder.find(d);
    const so = await SalesOrder.deleteMany(d);
    if (!so) {
      resultData["oldSO"] = false;
      console.log("SO not found");
    }else{
      resultData["oldSO"] = true;
      console.log("Sales order deleted successfully");
    }   
    
    try {

      let allEmpIds = [];

      saleorder.all_manpower.forEach(eq => {
        allEmpIds.push(eq.empid)
      });

      console.log(allEmpIds)
      
      const filter = {
        "projects": {
          $elemMatch: {
            project_id: saleorder.p_id,
            project_location: saleorder.location
          }
        },
        "empid": { $in: allEmpIds }
      };
    
      const update = {
        $pull: {
          projects: {
            project_id: saleorder.p_id,
            project_location: saleorder.location
          }
        }
      };
    
      const result = await EmployeeMaster.updateMany(filter, update);
    
      if (result.nModified > 0) {
        console.log(`Object removed successfully from the array in employees for ${allEmpIds.length} employees`, result);
      } else {
        console.log(`Project not found in employees for ${allEmpIds.length} employees`);
      }
    
      res.status(200).json({ message: "so deleted successfully",so});
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
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