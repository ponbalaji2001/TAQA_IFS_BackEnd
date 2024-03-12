const Project = require("../models/Project");
const SalesOrder = require("../models/SalesOrder");
const EmployeeMaster = require("../models/employee");
const User = require("../models/User");
const mongoose = require('mongoose');
const TimeSheet = require("../models/timesheet");
const EquipTs = require("../models/EquipTs");
const MatTS = require("../models/matTs");

//Create project
const createProject = async (req, res) => {
  try {
    const data = req.body;
    const project = await Project.create({
      title: data.title,
      pid: random7DigitNumber(),
      assignee: data.assignee,
      reporter: data.reporter,
      location: data.location,
      priority: data.priority,
      description: data.description,
      start_date: data.start_date,
      end_date: data.end_date,
      status: data.status,
      createdby:data.createdby,
      phases: data.phases
    });

    let totalManpowerCost = 0;
    let totalEquipmentCost = 0;
    let totalMaterialsCost =0;
    let totalCost = 0;
    let tax = 0;
    let allEquipments = [];
    let allMaterials = [];
    let allManPower = [];
    let allEmpIds = [];

    if (data.phases) {
      for(let [index,phases] of data.phases.entries()) {
        for(let task of phases.tasks) {
          for(let taskType of Object.keys(task)) {
            const taskArray = task[taskType] || [];

            if (taskArray.length > 0) {
              for(let item of taskArray) {
                console.log(item);

                const supervisorIds = item.management_members.supervisors.map(
                  (supervisor) => new mongoose.Types.ObjectId(supervisor.supervisor_id)
                );
                const managerIds = item.management_members.managers.map(
                  (manager) => new mongoose.Types.ObjectId(manager.manager_id)
                );
  
                const allMemberIds = [...supervisorIds, ...managerIds];
  
                const uniqueMemberIds = [...new Set(allMemberIds)];

                console.log("all members id",  allMemberIds)
                console.log("unique members id", uniqueMemberIds)

                try {
                  const filter = {
                    object_id: { $in: uniqueMemberIds },
                  };
                  
                  const update = {
                    $push: {
                      projects: {
                        project_object_id: project._id,
                        project_id: project.pid,
                        project_name: project.title,
                        phase: project.phases[index].phase,
                        phase_name: project.phases[index].phase_name,
                        phase_description: project.phases[index].phase_description,
                        phase_start: project.phases[index].phase_start,
                        phase_end: project.phases[index].phase_end,
                        tasks: [
                          {
                            task_type: taskType,
                            man_power: item.man_power,
                            equipment: item.equipment,
                            material: item.material,
                          },
                        ],
                      },
                    },
                  };
                  
                  const result = await User.updateMany(filter, update);

                  if (result) {
                    console.log("Employee Supervisor details updated successfully");
                  }
                } catch (error) {
                  console.log(error);
                }

                console.log(item);
                for (let eq of item.man_power) {

                  const manpowerDetails = {
                    project_id: project.pid,
                    project_object_id:project._id,
                    empid: eq.empid,
                    empname: eq.empname,
                    experience: eq.experience,
                    designation: eq.designation,
                    salary: eq.salary,
                    supervisor_id: eq.supid,
                    _id: eq._id,
                    phase_start: eq.phase_start,
                    phase_end: eq.phase_end,
                    start_date: eq.start_date,
                    end_date: eq.end_date
                  };

                  // try {
                  //   const filter = {
                  //     _id: eq.supervisor_id
                  //   };
                  //   const update = {
                  //     $push: {
                  //       assigned_emps: manpowerDetails
                  //     }
                  //   };

                  //   const result = await User.updateMany(filter, update);

                  //   if (result) {
                  //     console.log("Employee Supervisor details updated successfully");
                  //   }
                  // } catch (error) {
                  //   console.log(error);
                  // }

                  
                  allEmpIds.push(eq.empid);
                  totalManpowerCost += eq.salary;
                  allManPower.push(manpowerDetails);
                  // console.log("Checking inside data", manpowerDetails, allManPower);

                  if (eq.role === "user") {
                    let sendData = {
                      _id: eq._id,
                      empid: eq.empid,
                      empname: eq.empname,
                      role: eq.role,
                      supid: eq.supervisor_id,
                      projectid: project._id,
                      pro_start_date: eq.start_date,
                      pro_end_date: eq.end_date,
                    };
                    try {
                      const newTS = await createTimeSheet(sendData);
                    }catch (error) {
                      console.error("Error creating timesheet:", error);
                    }
                  }
                };

                for (let eq of item.equipment) {
                  const equipmentDetails = {
                    equipmentid: eq._id,
                    name: eq.name,
                    quantity: eq.quantity,
                    cost: eq.cost,
                    specification: eq.specification,
                    start_date: eq.start_date,
                    end_date: eq.end_date,
                    usage_hours:eq.usage_hours
                  };

                  const equipts={
                    equipment_id:eq._id,
                    equipment_name: eq.name,
                    quantity:eq.quantity,
                    current_supervisor_id:eq.supervisor_id,
                    current_project_id:project._id,
                    current_phase:eq.current_phase,
                    current_task:eq.current_task,
                    current_phase_start_date:eq.start_date,
                    current_phase_end_date:eq.end_date,
                  }
                  try {
                    const newEquipTS = await createEquipTS(equipts);                    
                  }catch (error) {
                    console.error("Error creating timesheet:", error);
                  }

                  totalEquipmentCost += eq.quantity * eq.cost;

                  allEquipments.push(equipmentDetails);
                };

                for (let mt of item.material) {
                  const matDetails = {
                    materialid: mt._id,
                    materialname: mt.materialname,
                    quantity: mt.quantity,
                    cost: mt.cost,
                    unit:mt.unit,
                    specification: mt.specification,
                  };

                  const mats={
                    material_id:mt._id,
                    material_name: mt.materialname,
                    quantity: mt.quantity,
                    current_supervisor_id:mt.supervisor_id,
                    current_project_id:project._id,
                    current_phase:mt.current_phase,
                    current_task:mt.current_task,
                    current_phase_start_date:mt.start_date,
                    current_phase_end_date:mt.end_date,
                  }
                  try {
                    const newEquipTS = await createMatTS(mats);                    
                  }catch (error) {
                    console.error("Error creating timesheet:", error);
                  }

                  totalMaterialsCost += mt.quantity * mt.cost;

                  allMaterials.push(matDetails);
                };

              };
            }
          };
          // console.log("Each Task", allManPower);
        };
        // console.log("Each Phase", allManPower);
      };
    }

    // console.log("All Manpower:", allManPower);
    // console.log("All Equipments:", allEquipments);
    // console.log("All Equipments:", allMaterials);
    // console.log("Total Manpower Cost:", totalManpowerCost);
    // console.log("Total Equipment Cost:", totalEquipmentCost);

    console.log(allEmpIds)
    try {
      const filter = {
        empid: {
          $in: allEmpIds
        }
      };
      const update = {
        $push: {
          projects: {
            project_object_id:project._id,
            project_id: project.pid,
            project_name:project.title,
            project_location: project.location,
          }
        }
      };

      const result = await EmployeeMaster.updateMany(filter, update);

      if (result) {
        console.log("Employee Project details updated successfully", result);
      }
    } catch (error) {
      console.log(error);
    }

  
    totalCost = totalManpowerCost + totalEquipmentCost + totalMaterialsCost;
    tax = (15/100) * totalCost;

    console.log(totalManpowerCost + " " + totalEquipmentCost + " " + totalMaterialsCost + " " +totalCost);
    let ordDetails = {
      p_id: project.pid,
      issue_date: project.createdby.date,
      due_date: project.end_date,
      project_location: project.location || " ",
      name: data.title,
      order_number: random8DigitNumber(),
      order_id: project._id,
      items: itemRandomNumber(),
      phases: project.phases,
      all_manpower: allManPower,
      all_equipment: allEquipments,
      all_material:allMaterials,
      total_manpower_cost: totalManpowerCost,
      total_equipment_cost: totalEquipmentCost,
      total_material_cost: totalMaterialsCost,
      total_cost: totalCost,
      tax: tax,
      amount_due: totalCost + tax,
      status: "Pending",
      createdby:project.createdby
    }

    const cso = await createSaleOrder(ordDetails);
    // console.log("cso worked", cso);
    res.status(200).json({
      message: "Project created successfully",
      project,
      cso
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
};

const createTimeSheet = async (details) => {

  try {
    let data = details;
    const newts = await TimeSheet.create({
      employee_id: data._id,
      empid: data.empid,
      empname: data.empname,
      role: data.role,
      current_supervisor_id: new mongoose.Types.ObjectId(data.supid),
      current_project_id: data.projectid,
      current_phase_start_date: data.pro_start_date,
      current_phase_end_date: data.pro_end_date,
      timesheets: [],
      tsStatus: "active"
    });
    console.log("Timesheet created : ", newts);
    return true;
  } catch (err) {
    console.log("While ts creating ", err);
    return false;
  }
}


const createSaleOrder = async (productDetails) => {
  try {
    const data = productDetails;
    const salesorder = await SalesOrder.create({
      p_id: data.p_id,
      issue_date: data.issue_date,
      due_date: data.due_date,
      project_location: data.project_location,
      name: data.name,
      order_number: data.order_number,
      order_id: data.order_id,
      items: data.items,
      phases: data.phases,
      all_manpower: data.all_manpower,
      all_equipment: data.all_equipment,
      all_material:data.all_material,
      total_manpower_cost: data.total_manpower_cost,
      total_equipment_cost: data.total_equipment_cost,
      total_material_cost:data.total_material_cost,
      total_cost: data.total_cost,
      tax: data.tax,
      amount_due: data.amount_due,
      status: data.status,
      createdby:data.createdby,
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
    Project.aggregate([{
      $match: {
        _id: new mongoose.Types.ObjectId(req.body.id)
      }
    }]).then(result => {
      console.log("fetched result", result.length);
      res.status(200).json(result);
    }).catch(err => {
      console.error(err);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

// Get all projects data
const getAllProjectsList = async (req, res) => {
  try {
    // const allProjects = await Project.find();
    Project.aggregate([{
      $project: {
        pid: 1,
        title: 1,
        assignee: 1,
        status: 1,
        start_date: 1,
        end_date: 1,
        location: 1,
        _id: 1 // Excluding _id field
      }
    }]).then(result => {
      console.log("fetched result", result.length);
      res.status(200).json(result);
    }).catch(err => {
      console.error(err);
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error"
    });
  }
};

const updateProjectbyId = async (req, res) => {
  const projectId = req.params.id;
  const data = req.body;
  
    let resultData = {};
    try {
      const data = req.body;
      const project = await Project.create({
        title: data.title,
        pid: random7DigitNumber(),
        assignee: data.assignee,
        reporter: data.reporter,
        location: data.location,
        priority: data.priority,
        description: data.description,
        start_date: data.start_date,
        end_date: data.end_date,
        status: data.status,
        createdby:data.createdby,
        phases: data.phases
      });
  
      let totalManpowerCost = 0;
      let totalEquipmentCost = 0;
      let totalMaterialsCost =0;
      let totalCost = 0;
      let tax = 0;
      let allEquipments = [];
      let allMaterials = [];
      let allManPower = [];
      let allEmpIds = [];
  
      if (data.phases) {
        for(let [index,phases] of data.phases.entries()) {
          for(let task of phases.tasks) {
            for(let taskType of Object.keys(task)) {
              const taskArray = task[taskType] || [];
  
              if (taskArray.length > 0) {
                for(let item of taskArray) {
                  console.log(item);
  
                  const supervisorIds = item.management_members.supervisors.map(
                    (supervisor) => new mongoose.Types.ObjectId(supervisor.supervisor_id)
                  );
                  const managerIds = item.management_members.managers.map(
                    (manager) => new mongoose.Types.ObjectId(manager.manager_id)
                  );
    
                  const allMemberIds = [...supervisorIds, ...managerIds];
    
                  const uniqueMemberIds = [...new Set(allMemberIds)];
  
                  console.log("all members id",  allMemberIds)
                  console.log("unique members id", uniqueMemberIds)
  
                  try {
                    const filter = {
                      object_id: { $in: uniqueMemberIds },
                    };
                    
                    const update = {
                      $push: {
                        projects: {
                          project_object_id: project._id,
                          project_id: project.pid,
                          project_name: project.title,
                          phase: project.phases[index].phase,
                          phase_name: project.phases[index].phase_name,
                          phase_description: project.phases[index].phase_description,
                          phase_start: project.phases[index].phase_start,
                          phase_end: project.phases[index].phase_end,
                          tasks: [
                            {
                              task_type: taskType,
                              man_power: item.man_power,
                              equipment: item.equipment,
                              material: item.material,
                            },
                          ],
                        },
                      },
                    };
                    
                    const result = await User.updateMany(filter, update);
  
                    if (result) {
                      console.log("Employee Supervisor details updated successfully");
                    }
                  } catch (error) {
                    console.log(error);
                  }
  
                  console.log(item);
                  for (let eq of item.man_power) {
  
                    const manpowerDetails = {
                      project_id: project.pid,
                      project_object_id:project._id,
                      empid: eq.empid,
                      empname: eq.empname,
                      experience: eq.experience,
                      designation: eq.designation,
                      salary: eq.salary,
                      supervisor_id: eq.supid,
                      _id: eq._id,
                      phase_start: eq.phase_start,
                      phase_end: eq.phase_end,
                      start_date: eq.start_date,
                      end_date: eq.end_date
                    };
  
                    // try {
                    //   const filter = {
                    //     _id: eq.supervisor_id
                    //   };
                    //   const update = {
                    //     $push: {
                    //       assigned_emps: manpowerDetails
                    //     }
                    //   };
  
                    //   const result = await User.updateMany(filter, update);
  
                    //   if (result) {
                    //     console.log("Employee Supervisor details updated successfully");
                    //   }
                    // } catch (error) {
                    //   console.log(error);
                    // }
  
                    
                    allEmpIds.push(eq.empid);
                    totalManpowerCost += eq.salary;
                    allManPower.push(manpowerDetails);
                    // console.log("Checking inside data", manpowerDetails, allManPower);
  
                    if (eq.role === "user") {
                      let sendData = {
                        _id: eq._id,
                        empid: eq.empid,
                        empname: eq.empname,
                        role: eq.role,
                        supid: eq.supervisor_id,
                        projectid: project._id,
                        pro_start_date: eq.start_date,
                        pro_end_date: eq.end_date,
                      };
                      try {
                        const newTS = await createTimeSheet(sendData);
                      }catch (error) {
                        console.error("Error creating timesheet:", error);
                      }
                    }
                  };
  
                  for (let eq of item.equipment) {
                    const equipmentDetails = {
                      equipmentid: eq._id,
                      name: eq.name,
                      quantity: eq.quantity,
                      cost: eq.cost,
                      specification: eq.specification,
                      start_date: eq.start_date,
                      end_date: eq.end_date,
                      usage_hours:eq.usage_hours
                    };
  
                    const equipts={
                      equipment_id:eq._id,
                      equipment_name: eq.name,
                      quantity:eq.quantity,
                      current_supervisor_id:eq.supervisor_id,
                      current_project_id:project._id,
                      current_phase:eq.current_phase,
                      current_task:eq.current_task,
                      current_phase_start_date:eq.start_date,
                      current_phase_end_date:eq.end_date,
                    }
                    try {
                      const newEquipTS = await createEquipTS(equipts);                    
                    }catch (error) {
                      console.error("Error creating timesheet:", error);
                    }
  
                    totalEquipmentCost += eq.quantity * eq.cost;
  
                    allEquipments.push(equipmentDetails);
                  };
  
                  for (let mt of item.material) {
                    const matDetails = {
                      materialid: mt._id,
                      materialname: mt.materialname,
                      quantity: mt.quantity,
                      cost: mt.cost,
                      unit:mt.unit,
                      specification: mt.specification,
                    };
  
                    const mats={
                      material_id:mt._id,
                      material_name: mt.materialname,
                      quantity:mt.quantity,
                      current_supervisor_id:mt.supervisor_id,
                      current_project_id:project._id,
                      current_phase:mt.current_phase,
                      current_task:mt.current_task,
                      current_phase_start_date:mt.start_date,
                      current_phase_end_date:mt.end_date,
                    }
                    try {
                      const newEquipTS = await createMatTS(mats);                    
                    }catch (error) {
                      console.error("Error creating timesheet:", error);
                    }
  
                    totalMaterialsCost += mt.quantity * mt.cost;
  
                    allMaterials.push(matDetails);
                  };
  
                };
              }
            };
            // console.log("Each Task", allManPower);
          };
          // console.log("Each Phase", allManPower);
        };
      }
  
      // console.log("All Manpower:", allManPower);
      // console.log("All Equipments:", allEquipments);
      // console.log("All Equipments:", allMaterials);
      // console.log("Total Manpower Cost:", totalManpowerCost);
      // console.log("Total Equipment Cost:", totalEquipmentCost);
  
      console.log(allEmpIds)
      try {
        const filter = {
          empid: {
            $in: allEmpIds
          }
        };
        const update = {
          $push: {
            projects: {
              project_object_id:project._id,
              project_id: project.pid,
              project_name:project.title,
              project_location: project.location,
            }
          }
        };
  
        const result = await EmployeeMaster.updateMany(filter, update);
  
        if (result) {
          console.log("Employee Project details updated successfully", result);
        }
      } catch (error) {
        console.log(error);
      }
  
    
      totalCost = totalManpowerCost + totalEquipmentCost + totalMaterialsCost;
      tax = (15/100) * totalCost;
  
      console.log(totalManpowerCost + " " + totalEquipmentCost + " " + totalMaterialsCost + " " +totalCost);
      let ordDetails = {
        p_id: project.pid,
        issue_date: project.createdby.date,
        due_date: project.end_date,
        project_location: project.location || " ",
        name: data.title,
        order_number: random8DigitNumber(),
        order_id: project._id,
        items: itemRandomNumber(),
        phases: project.phases,
        all_manpower: allManPower,
        all_equipment: allEquipments,
        all_material:allMaterials,
        total_manpower_cost: totalManpowerCost,
        total_equipment_cost: totalEquipmentCost,
        total_material_cost: totalMaterialsCost,
        total_cost: totalCost,
        tax: tax,
        amount_due: totalCost + tax,
        status: "Pending",
        createdby:project.createdby
      }
  
      const cso = await createSaleOrder(ordDetails);
      console.log("cso worked", cso);
  
    } catch (error) {
      console.log(error);
    }
    
    
    try {
      const project = await Project.findByIdAndDelete(projectId);
   
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

   
      try {
     
        const filterProjects = {
          "projects": {
            $elemMatch: {
              project_object_id: new mongoose.Types.ObjectId(projectId)
            }
          }
        };
  
        // const filterAssignedEmps = {
        //   "assigned_emps": {
        //     $elemMatch: {
        //       project_object_id: new mongoose.Types.ObjectId(projectId)
        //     }
        //   }
        // };
     
        
        const updateProjects = {
          $pull: {
            projects: {
              project_object_id: new mongoose.Types.ObjectId(projectId)
            }
          }
        };
  
        // const updateAssignedEmps = {
        //   $pull: {
        //     assigned_emps: {
        //       project_object_id: new mongoose.Types.ObjectId(projectId)
        //     }
        //   }
        // };
     
        // const assignemps_result = await User.updateMany(filterAssignedEmps, updateAssignedEmps);
        const result = await User.updateMany(filterProjects ,updateProjects);
     
        if (result) {
          console.log(`Projcet removed successfully from Supervisors and Managers`, result);
        } else {
          console.log(`Project not found in Supervisors and Managers`);
        }
     
      } catch (error) {
        console.log(error);
      }
     
   
    } catch (error) {
      console.log(error)
    }
   
     let d = { order_id: projectId};
   
      try {
   
        const saleorder = await SalesOrder.find(d);
   
        let allEmpIds = [];
       
  
        for(let eq of saleorder[0]["all_manpower"]) {
          allEmpIds.push(eq.empid);
        }
   
        console.log(allEmpIds)
       
        const filter = {
          "projects": {
            $elemMatch: {
              project_id: saleorder[0].p_id,
              project_location: saleorder[0].project_location
            }
          },
          "empid": { $in: allEmpIds }
        };
     
        const update = {
          $pull: {
            projects: {
              project_id: saleorder[0].p_id,
              project_location: saleorder[0].project_location
            }
          }
        };
     
        const result = await EmployeeMaster.updateMany(filter, update);
     
        if (result) {
          console.log(`Object removed successfully from the array in employees for ${allEmpIds.length} employees`, result);
        } else {
          console.log(`Project not found in employees for ${allEmpIds.length} employees`);
        }
     
      } catch (error) {
        console.log(error);
      }
   
      const so = await SalesOrder.deleteMany(d);
      if (!so) {
        resultData["oldSO"] = false;
        console.log("SO not found");
      }else{
        resultData["oldSO"] = true;
        console.log("Sales order deleted successfully");
      }  
  
    const ts= await TimeSheet.deleteMany({current_project_id:new mongoose.Types.ObjectId(projectId)})
    console.log("manpower timesheet deleted: ",ts);

    const eqts= await EquipTs.deleteMany({current_project_id:new mongoose.Types.ObjectId(projectId)})
    console.log("equipment timesheet deleted: ",eqts);

    const matts= await MatTS.deleteMany({current_project_id:new mongoose.Types.ObjectId(projectId)})
    console.log("material timesheet deleted: ",matts);
     
    console.log(resultData);
    
    res.status(200).json({
      message: "Project updated successfully",
      data: resultData
    });
 
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
 
    try {
   
      const filterProjects = {
        "projects": {
          $elemMatch: {
            project_object_id: new mongoose.Types.ObjectId(projectId)
          }
        }
      };

      // const filterAssignedEmps = {
      //   "assigned_emps": {
      //     $elemMatch: {
      //       project_object_id: new mongoose.Types.ObjectId(projectId)
      //     }
      //   }
      // };
   
      
      const updateProjects = {
        $pull: {
          projects: {
            project_object_id: new mongoose.Types.ObjectId(projectId)
          }
        }
      };

      // const updateAssignedEmps = {
      //   $pull: {
      //     assigned_emps: {
      //       project_object_id: new mongoose.Types.ObjectId(projectId)
      //     }
      //   }
      // };
   
      // const assignemps_result = await User.updateMany(filterAssignedEmps, updateAssignedEmps);
      const result = await User.updateMany(filterProjects ,updateProjects);
   
      if (result) {
        console.log(`Projcet removed successfully from Supervisors and Managers`, result);
      } else {
        console.log(`Project not found in Supervisors and Managers`);
      }
   
    } catch (error) {
      console.log(error);
    }
   
 
  } catch (error) {
    console.log(error)
    // res.status(500).json({ message: "Internal server error" });
  }
 
   let d = { order_id: projectId};
 
    try {
 
      const saleorder = await SalesOrder.find(d);
 
      let allEmpIds = [];
     

      for(let eq of saleorder[0]["all_manpower"]) {
        allEmpIds.push(eq.empid);
      }
 
      console.log(allEmpIds)
     
      const filter = {
        "projects": {
          $elemMatch: {
            project_id: saleorder[0].p_id,
            project_location: saleorder[0].project_location
          }
        },
        "empid": { $in: allEmpIds }
      };
   
      const update = {
        $pull: {
          projects: {
            project_id: saleorder[0].p_id,
            project_location: saleorder[0].project_location
          }
        }
      };
   
      const result = await EmployeeMaster.updateMany(filter, update);
   
      if (result) {
        console.log(`Object removed successfully from the array in employees for ${allEmpIds.length} employees`, result);
      } else {
        console.log(`Project not found in employees for ${allEmpIds.length} employees`);
      }
   
    } catch (error) {
      console.log(error);
    }
 
    const so = await SalesOrder.deleteMany(d);
    if (!so) {
      resultData["oldSO"] = false;
      console.log("SO not found");
    }else{
      resultData["oldSO"] = true;
      console.log("Sales order deleted successfully");
    }  

    // const ts= await updateTsStatus(projectId);
    const ts= await TimeSheet.deleteMany({current_project_id:new mongoose.Types.ObjectId(projectId)})
    console.log("manpower timesheet deleted: ",ts);

    const eqts= await EquipTs.deleteMany({current_project_id:new mongoose.Types.ObjectId(projectId)})
    console.log("equipment timesheet deleted: ",eqts);

    const matts= await MatTS.deleteMany({current_project_id:new mongoose.Types.ObjectId(projectId)})
    console.log("material timesheet deleted: ",matts);
   

    res.status(200).json({ message: "project deleted successfully"});
   
};


const updateTsStatus = async (project_id) => {
  try {
    const result = await TimeSheet.updateMany(
      {_id: new mongoose.Types.ObjectId(project_id) },
      { $set: { tsStatus: "deactivate" } }
    );

    console.log(result);

    if (result.nModified > 0) {
      // Check if any document was modified
      return result;
    } else {
      // No documents were modified
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
  }
}


const FilterProjectsList = async (req, res) => {
  try {
    const data = req.body;
    const sort_order =  parseInt(data.sort_type, 10) || 1;

    const matchConditions = [
      data.start_date && data.start_date_filter === "gte" ? { start_date: { $gte: new Date(data.start_date) } } : {},
      data.start_date && data.start_date_filter === "gt" ? { start_date: { $gt: new Date(data.start_date) } } : {},
      data.start_date && data.start_date_filter === "lte" ? { start_date: { $lte: new Date(data.start_date) } } : {},
      data.start_date && data.start_date_filter === "lt" ? { start_date: { $lt: new Date(data.start_date) } } : {},
      data.start_date && data.start_date_filter === "eq" ? { start_date: { $eq: new Date(data.start_date) } } : {},
      data.end_date && data.end_date_filter === "gte" ? { end_date: { $gte: new Date(data.end_date) } } : {},
      data.end_date && data.end_date_filter === "gt" ? { end_date: { $gt: new Date(data.end_date) } } : {},
      data.end_date && data.end_date_filter === "lte" ? { end_date: { $lte: new Date(data.end_date) } } : {},
      data.end_date && data.end_date_filter === "lt" ? { end_date: { $lt: new Date(data.end_date) } } : {},
      data.end_date && data.end_date_filter === "eq" ? { end_date: { $eq: new Date(data.end_date) } } : {},
      (data.status && data.status!="") ? { status: data.status } : {},
    ];

    const matchStage = { $match: { $and: matchConditions } };
  
    const projectList = await Project.aggregate([
      matchStage,
      {
        $project: {
          pid: 1,
          title: 1,
          assignee: 1,
          status: 1,
          start_date: 1,
          end_date: 1,
          location: 1,
          _id: 1,
        }
      },
      { 
        $sort: { [data.sortby]: sort_order } 
      }
    ]);

    console.log("fetched result", projectList.length);
    res.status(200).json(projectList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



const random8DigitNumber = () => {

  let randomNumber = Math.floor(Math.random() * 100000000);

  let randomString = randomNumber.toString();

  while (randomString.length < 8) {
    randomString = '0' + randomString;
  }
  return randomString;
}

const random7DigitNumber = () => {

  let randomNumber = Math.floor(Math.random() * 100000000);

  let randomString = randomNumber.toString();

  while (randomString.length < 7) {
    randomString = '0' + randomString;
  }
  return randomString;
}

const itemRandomNumber = () => {
  return Math.floor(Math.random() * (700 - 100 + 1)) + 100;
}

const createEquipTS = async (data) => {

  try {
    // let data = req.body;
    const newts = await EquipTs.create({
      equipment_id: data.equipment_id,
      equipment_name: data.equipment_name,
      quantity: data.quantity,
      current_supervisor_id: new mongoose.Types.ObjectId(data.current_supervisor_id),
      current_project_id: data.current_project_id,
      current_phase:data.current_phase,
      current_task:data.current_task,
      current_phase_start_date: data.current_phase_start_date,
      current_phase_end_date: data.current_phase_end_date,
      timesheets: [],
      tsStatus: "active"
    });
    console.log("Timesheet created : ", newts);
    return "Ts creation Successfully";
  } catch (err) {
    console.log("While ts creating ", err);
    return "Ts creation Failed";
  }
}

const createMatTS = async (data) => {

  try {
    // let data = req.body;
    const newts = await MatTS.create({
      material_id: data.material_id,
      material_name: data.material_name,
      quantity: data.quantity,
      current_supervisor_id: new mongoose.Types.ObjectId(data.current_supervisor_id),
      current_project_id: data.current_project_id,
      current_phase:data.current_phase,
      current_task:data.current_task,
      current_phase_start_date: data.current_phase_start_date,
      current_phase_end_date: data.current_phase_end_date,        
      timesheets: [],
      tsStatus: "active"
    });
    console.log("Timesheet created : ", newts);
    return "TS Creation Successfully";
  } catch (err) {
    console.log("While ts creating ", err);
    return "TS Creation Failed";
  }
}

module.exports = {
  createProject,
  getProjectById,
  deleteProjectById,
  getAllProjectsList,
  updateProjectbyId,
  FilterProjectsList
};