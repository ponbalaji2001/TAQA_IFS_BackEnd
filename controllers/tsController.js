const TimeSheet = require("../models/timesheet");
const mongoose = require('mongoose');
// const EmployeeMaster = require("../models/employee"); 
const EquipTs = require("../models/EquipTs");
// const EquipmentMaster = require("../models/Equipment");
const Project = require("../models/Project");
const User = require("../models/User");
const MatTS = require("../models/matTs");


const alive = async(req,res)=>{
    console.log("payroll");
    res.status(500).json("Success");
}

const getTs = async(req,res)=>{
  console.log("get payroll",req.body);
  let monthstatus = req.body.month;
  try{
    if(monthstatus === "all"){   
      const resTs = await TimeSheet.findOne({ 
        employee_id: new mongoose.Types.ObjectId(req.body.employee_id),
        current_supervisor_id: new mongoose.Types.ObjectId(req.body.current_supervisor_id),
        tsStatus:"active"
      })
      .then(timesheet => {
        if (timesheet) {
          // Timesheet document found, you can use it here
          // console.log(timesheet);
          return res.status(200).json({ 
            message: "Timesheet Found successfully",
            res:[timesheet]
          });
        } else {
          // Timesheet document not found
          console.log('Timesheet not found');
          return res.status(200).json({ 
            message: "Timesheet Not Found",
            res:timesheet
          });
        }
      })
      .catch(err => {
        // Error occurred while fetching the document
        console.error(err);
        res.status(500).json({ message: "Timesheet error" });
      })
  }else{
    console.log("else block")
    const resTs = await TimeSheet.aggregate([
      {
        $match: {
          employee_id: new mongoose.Types.ObjectId(req.body.employee_id),
          current_supervisor_id: new mongoose.Types.ObjectId(req.body.current_supervisor_id),
          'timesheets.month': monthstatus,
          tsStatus:"active"
        }
      },
      {
        $project: {
          _id: 1,
          employee_id: 1,
          empid: 1,
          current_supervisor_id: 1,
          current_project_id: 1,
          current_phase_start_date: 1,
          current_phase_end_date: 1,
          timesheets: {
            $filter: {
              input: '$timesheets',
              as: 'timesheet',
              cond: { $eq: ['$$timesheet.month', monthstatus] }
            }
          }
        }
      }
    ])
    .then(timesheet => {
      if (timesheet) {
        // Timesheet document found, you can use it here
        // console.log(timesheet);
        return res.status(200).json({ 
          message: "Timesheet Found successfully",
          res:timesheet
        });
      } else {
        // Timesheet document not found
        console.log('Timesheet not found');
        return res.status(200).json({ 
          message: "Timesheet Not Found",
          res:timesheet
        });
      }
    })
    .catch(err => {
      // Error occurred while fetching the document
      console.error(err);
      res.status(500).json({ message: "Timesheet error" });
    })

  }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



const updateTs = async (req, res) => {
    console.log("body",req.body);
    let data =  req.body;
    let employee_id  =  req.body.employee_id; 
    let current_supervisor_id = req.body.current_supervisor_id;
    let tsdays = data.timesheets;   
    try {
      const ts = await TimeSheet.findOne({ employee_id });
      console.log("found",ts);
      if (ts){
        TimeSheet.updateOne(
          { 
            employee_id: employee_id,
            current_supervisor_id:current_supervisor_id
          }, // Specify the employee to update
          { $push: { timesheets: { $each: tsdays } } } // Add the new objects to the timesheets array
        ).then(result => {
            console.log(result);
            return res.status(200).json({ 
              message: "Timesheet saved successfully",
              res:result
          });
        }).catch(err => {
            console.error(err);
            return res.status(200).json({ 
              message: "Timesheet Error",
              res:err,
          });
        });        
        //update timesheet trigeers        
      }else{
        return res.status(200).json({ 
          message: "Timesheet Not Found",
          res:[],
      });
      }    
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  //for existing days 
const updateTsDays = async (req, res) => {
  console.log( req.body);
  let _id  =  req.body._id;  
  let dateid = req.body.dateid;
  let datehours = req.body.hoursWorked;
  let daystatus = req.body.status;
  try {
    const ts = await TimeSheet.findOne({ _id });
    console.log(ts);
    if (ts){
      TimeSheet.updateOne(
        { 'timesheets._id': dateid },
        { $set: { 
          'timesheets.$.hoursWorked': datehours,
          "timesheets.$.status": daystatus
        } }          
      ).then(result => {
          console.log(result);
          return res.status(200).json({ 
            message: "Timesheet days updated successfully",
            res:result
        });
      }).catch(err => {
          console.error(err);
          return res.status(200).json({ 
            message: "Timesheet Error",
            res:err,
        });
      });        
      //update timesheet trigeers        
    }      
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}


const updateTsStatus = async (req, res) => {
  console.log( req.body);
  let _id  =  req.body._id;  
  try {
    const ts = await TimeSheet.findOne({ _id });
    console.log(ts);
    if (ts){
      TimeSheet.updateOne(
        { _id: _id }, // Specify the employee to update
        {$set:{tsStatus:req.body.tsStatus} } // Add the new objects to the timesheets array
      ).then(result => {
          console.log(result);
          return res.status(200).json({ 
            message: "Timesheet status updated successfully",
            res:result,
            data:ts 
        });
      }).catch(err => {
          console.error(err);
          return res.status(200).json({ 
            message: "Timesheet Error",
            res:err,
        });
      });        
      //update timesheet trigeers        
    }      
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
 
const dslReport = async (req, res) => {
  console.log( req.body);
  let data = req.body;
  let querydata = {
    current_supervisor_id : new mongoose.Types.ObjectId(data.current_supervisor_id), //supervisor 1      
    current_project_id: new mongoose.Types.ObjectId(data.current_project_id),
    task:data.task,
  };
  //date:"2024-02-01T18:30:00.000+00:00",
  
  const project_data = await Project.findById(data.current_project_id)

  let project_phase_details= {
    project_id : project_data._id,    
    project_name: project_data.name,
    project_location:project_data.location,
    project_start: project_data.start_date,
    project_end: project_data.end_date,
    phase:data.phase,
    phase_name:project_data.phases[data.phase-1].phase_name,
    phase_start:project_data.phases[data.phase-1].phase_start,
    phase_end:project_data.phases[data.phase-1].phase_end,
    task:data.task,
  };
  
  try {
    const queryDate = new Date(data.date);
      
    
    TimeSheet.aggregate([
      {
        $match: {
          current_supervisor_id: querydata.current_supervisor_id, // Supervisor 1
          "timesheets.date": queryDate,
          current_project_id: querydata.current_project_id,
          "timesheets.task": querydata.task
        }
      },
      {
        $unwind: "$timesheets"
      },
      {
        $match: {
          "timesheets.date": queryDate,
          "timesheets.task": querydata.task
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: "$employee"
      },
      {
        $group: {
          _id: "$_id",
          current_supervisor_id: { $first: "$current_supervisor_id" },
          current_project_id: { $first: "$current_project_id" },
          manpower: {
            $push: {
              employee_id: "$employee_id",
              name: "$employee.empname",
              date: "$timesheets.date",
              hoursWorked: "$timesheets.hoursWorked",
              status: "$timesheets.status"
            }
          },
          totalHoursWorked: { $sum: "$timesheets.hoursWorked" }
        }
      }
    ])  
    .then(async result => {
        
        console.log("MANPOWER RES",result);
      
        let eqdata =  {
          project_id:data.project_id,
          phase:data.phase,
          task:data.task,
          supervisor_id: data.current_supervisor_id
        }
        // console.log("eqiupdata ",eqdata);
        
        const EquipsTs = await EquipTs.aggregate([
          {
            $match: {
              current_supervisor_id: querydata.current_supervisor_id, // Supervisor 1
              "timesheets.date": queryDate,
              current_project_id: querydata.current_project_id,
              current_phase:data.phase,
              current_task:data.task,
              "timesheets.task": querydata.task
            }
          },
          {
            $unwind: "$timesheets"
          },
          {
            $match: {
              "timesheets.date": queryDate,
              "timesheets.task": querydata.task
            }
          },
          {
            $lookup: {
              from: "equipment",
              localField: "equipment_id",
              foreignField: "_id",
              as: "equipment"
            }
          },
          {
            $unwind: "$equipment"
          },
          {
            $group: {
              _id: "$_id",
              current_supervisor_id: { $first: "$current_supervisor_id" },
              current_project_id: { $first: "$current_project_id" },
              current_phase: { $first: "$current_phase" },
              current_task: { $first: "$current_task" },
              equipments: {
                $push: {
                  equipment_id: "$equipment_id",
                  name: "$equipment.name",
                  date: "$timesheets.date",
                  hoursWorked: "$timesheets.hoursWorked",
                  status: "$timesheets.status"
                }
              },
              totalHoursWorked: { $sum: "$timesheets.hoursWorked" }
            }
          }
        ]).then(async tsresult => {              
        
        console.log("TS RESULT ",tsresult);
        const MaterialTs = await MatTS.aggregate([
          {
            $match: {
              current_supervisor_id: querydata.current_supervisor_id, // Supervisor 1
              "timesheets.date": queryDate,
              current_project_id: querydata.current_project_id,
              current_phase:data.phase,
              current_task:data.task,
              "timesheets.task": querydata.task
            }
          },
          {
            $unwind: "$timesheets"
          },
          {
            $match: {
              "timesheets.date": queryDate,
              "timesheets.task": querydata.task
            }
          },
          {
            $lookup: {
              from: "materials",
              localField: "material_id",
              foreignField: "_id",
              as: "material"
            }
          },
          {
            $unwind: "$material"
          },
          {
            $group: {
              _id: "$_id",
              current_supervisor_id: { $first: "$current_supervisor_id" },
              current_project_id: { $first: "$current_project_id" },
              current_phase: { $first: "$current_phase" },
              current_task: { $first: "$current_task" },
              material: {
                $push: {
                  materialid: "$material_id",
                  name: "$material.materialname",
                  date: "$timesheets.date",
                  qtyconsumed: "$timesheets.hoursWorked",
                  status: "$timesheets.status"
                }
              },
              totalqtyConsumed: { $sum: "$timesheets.hoursWorked" }
            }
          }
        ]).then(async matresult => {               
        
        console.log("TS RESULT ",matresult);
        res.status(200).json({ 
          message: "Fetched successfully",
          project_phase_data:project_phase_details,
          manpowerset:result,
          equipset:tsresult,
          materialTs:matresult
        });                   
        }).catch(err => {
            console.error(err);
            res.status(200).json({ 
              message: "Fetched successfully",
              project_phase_data:project_phase_details,
              manpowerset:result,
              equipset:tsresult,
              materialTs:[]
            });  
        });        
      }).catch(err => {
        console.error(err);
        res.status(200).json({ 
          message: "Fetched successfully",
          project_phase_data:project_phase_details,
          manpowerset:result,
          equipset:[],
          materialTs:[]
        });  
      });         
    }).catch(err => {
      console.error(err);
      res.status(200).json({ 
        message: "Fetched successfully",
        project_phase_data:project_phase_details,
        manpowerset:[],
        equipset:[],
        materialTs:[]
      });
    });
  }catch (error) {
    console.log(error);
    res.status(500).json({ 
      message: "Internal server error",
      project_phase_data:[],
      manpowerset:[],
      equipset:[],
      materialTs:[]
    });
  };
}


const mslReport = async (req, res) => {
  console.log("body", req.body);
  let data = req.body;
  let querydata = {
    current_supervisor_id : new mongoose.Types.ObjectId(data.current_supervisor_id), //supervisor 1      
    current_project_id: new mongoose.Types.ObjectId(data.current_project_id),
    task:data.task,
  };
  //date:"2024-02-01T18:30:00.000+00:00",

  const project_data = await Project.findById(data.current_project_id)

  if(!project_data){
    res.status(200).json({ message: "Project not found" });
  }

  let project_phase_details= {
    project_id : project_data._id,    
    project_name: project_data.name,
    project_location:project_data.location,
    project_start: project_data.start_date,
    project_end: project_data.end_date,
    phase:data.phase,
    phase_name:project_data.phases[data.phase-1].phase_name,
    phase_start:project_data.phases[data.phase-1].phase_start,
    phase_end:project_data.phases[data.phase-1].phase_end,
    task:data.task,
  };


  try {
    
    const startDate = new Date(data.phase_start);
    const endDate = new Date(data.phase_end);
    
    console.log(startDate+" "+endDate);
    TimeSheet.aggregate([
      {
        $match: {
          current_supervisor_id: querydata.current_supervisor_id, // Supervisor 1
          "timesheets.date": {$gte:startDate, $lte:endDate},
          current_project_id: querydata.current_project_id,
          "timesheets.task": querydata.task
        }
      },
      {
        $unwind: "$timesheets"
      },
      {
        $match: {
          "timesheets.date": {$gte:startDate, $lte:endDate},
          "timesheets.task": querydata.task
        }
      },
      {
        $lookup: {
          from: "employees",
          localField: "employee_id",
          foreignField: "_id",
          as: "employee"
        }
      },
      {
        $unwind: "$employee"
      },
      {
        $group: {
          _id: "$_id",
          current_supervisor_id: { $first: "$current_supervisor_id" },
          current_project_id: { $first: "$current_project_id" },
          manpower: {
            $push: {
              employee_id: "$employee_id",
              name: "$employee.empname",
              date: "$timesheets.date",
              hoursWorked: "$timesheets.hoursWorked",
              status: "$timesheets.status"
            }
          },
          totalHoursWorked: { $sum: "$timesheets.hoursWorked" }
        }
      }
    ])  
    .then(async result => {
        
      console.log("MANPOWER RES",result);
      
      let eqdata =  {
        project_id:data.project_id,
        phase:data.phase,
        task:data.task,
        supervisor_id: data.current_supervisor_id
      }
      // console.log("eqiupdata ",eqdata);
      
      const EquipsTs = await EquipTs.aggregate([
        {
          $match: {
            current_supervisor_id: querydata.current_supervisor_id, // Supervisor 1
            "timesheets.date": {$gte:startDate, $lte:endDate},
            current_project_id: querydata.current_project_id,
            current_phase:data.phase,
            current_task:data.task,
            "timesheets.task": querydata.task
          }
        },
        {
          $unwind: "$timesheets"
        },
        {
          $match: {
            "timesheets.date": {$gte:startDate, $lte:endDate},
            "timesheets.task": querydata.task
          }
        },
        {
          $lookup: {
            from: "equipment",
            localField: "equipment_id",
            foreignField: "_id",
            as: "equipment"
          }
        },
        {
          $unwind: "$equipment"
        },
        {
          $group: {
            _id: "$_id",
            current_supervisor_id: { $first: "$current_supervisor_id" },
            current_project_id: { $first: "$current_project_id" },
            current_phase: { $first: "$current_phase" },
            current_task: { $first: "$current_task" },
            equipments: {
              $push: {
                equipment_id: "$equipment_id",
                name: "$equipment.name",
                date: "$timesheets.date",
                hoursWorked: "$timesheets.hoursWorked",
                status: "$timesheets.status"
              }
            },
            totalHoursWorked: { $sum: "$timesheets.hoursWorked" }
          }
        }
      ]).then(async tsresult => {              
      
      console.log("TS RESULT ",tsresult);
      const MaterialTs = await MatTS.aggregate([
        {
          $match: {
            current_supervisor_id: querydata.current_supervisor_id, // Supervisor 1
            "timesheets.date": {$gte:startDate, $lte:endDate},
            current_project_id: querydata.current_project_id,
            current_phase:data.phase,
            current_task:data.task,
            "timesheets.task": querydata.task
          }
        },
        {
          $unwind: "$timesheets"
        },
        {
          $match: {
            "timesheets.date": {$gte:startDate, $lte:endDate},
            "timesheets.task": querydata.task
          }
        },
        {
          $lookup: {
            from: "materials",
            localField: "material_id",
            foreignField: "_id",
            as: "material"
          }
        },
        {
          $unwind: "$material"
        },
        {
          $group: {
            _id: "$_id",
            current_supervisor_id: { $first: "$current_supervisor_id" },
            current_project_id: { $first: "$current_project_id" },
            current_phase: { $first: "$current_phase" },
            current_task: { $first: "$current_task" },
            material: {
              $push: {
                materialid: "$material_id",
                name: "$material.materialname",
                date: "$timesheets.date",
                qtyconsumed: "$timesheets.hoursWorked",
                status: "$timesheets.status"
              }
            },
            totalqtyConsumed: { $sum: "$timesheets.hoursWorked" }
          }
        }
      ]).then(async matresult => {               
      
      console.log("TS RESULT ",matresult);
      res.status(200).json({ 
        message: "Fetched successfully",
        project_phase_data:project_phase_details,
        manpowerset:result,
        equipset:tsresult,
        materialTs:matresult
      });                   
      }).catch(err => {
          console.error(err);
          res.status(200).json({ 
            message: "Fetched successfully",
            project_phase_data:project_phase_details,
            manpowerset:result,
            equipset:tsresult,
            materialTs:[]
          });  
      });        
    }).catch(err => {
      console.error(err);
      res.status(200).json({ 
        message: "Fetched successfully",
        project_phase_data:project_phase_details,
        manpowerset:result,
        equipset:[],
        materialTs:[]
      });  
    });
      
       
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error",error:err });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getProjectAllTs = async (req, res) => {

  const ProjectId = req.params.id;
  console.log(ProjectId)
  
  try {
    const Employees = await TimeSheet.find({current_project_id:new mongoose.Types.ObjectId(ProjectId), role:"user"});
    const Supervisors = await TimeSheet.find({ role:"supervisor"});
    const Managers = await TimeSheet.find({ role:"manager" });
    const Equipments = await EquipTs.find({current_project_id: new mongoose.Types.ObjectId(ProjectId) });
    const Materials = await MatTS.find({current_project_id: new mongoose.Types.ObjectId(ProjectId) });
    const result={
      Managers:Managers,
      Supervisors:Supervisors,
      Employees:Employees,
      Equipments:Equipments,
      Materials:Materials
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateTs,
  updateTsStatus,
  updateTsDays,
  alive,
  getTs,
  dslReport,
  mslReport,
  getProjectAllTs
  
};

  

  
        
        // const employeeId = YOUR_EMPLOYEE_ID; // Replace YOUR_EMPLOYEE_ID with the specific employee's ObjectId
        // const givenYear = 2024; // Example given year

        // Employee.updateOne(
        //   { employee_id: employeeId },
        //   {
        //     $addToSet: {
        //       'timesheets.yearly.years': {
        //         year: givenYear,
        //         months: []
        //       }
        //     }
        //   }