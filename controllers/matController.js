const MatTS = require("../models/matTs");
const mongoose = require('mongoose');
// const EmployeeMaster = require("../models/employee"); 
// const Project = require("../models/Project");
// const User = require("../models/User");

const alive = async(req,res)=>{
    console.log("payroll");
    res.status(500).json("Success");
}

const createTimeSheet = async (req,res) => {

    try {
      let data = req.body;
      const newts = await MatTS.create({
        material_id: data.material_id,
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
      res.status(200).json({
        message: "Material Ts created successfully",       
      });
    } catch (err) {
      console.log("While ts creating ", err);
      res.status(500).json({
        message: "Internal Server Error",       
      });
    }
  }

//for fetch ts
const getMaterialTs = async(req,res)=>{
  console.log("get payroll",req.body);
  let data = req.body;
  try{
    let monthstatus = req.body.month;
    let material_id  =  new mongoose.Types.ObjectId(data.material_id); 
    let current_supervisor_id = new mongoose.Types.ObjectId(data.current_supervisor_id);
    let current_project_id  = new mongoose.Types.ObjectId(data.current_project_id);
    let current_phase = data.current_phase;
    let current_task = data.current_task;
    console.log(material_id,current_supervisor_id,current_project_id,current_phase,current_task);

    if(monthstatus === "all"){   
      const resTs = await MatTS.findOne({ 
        material_id: material_id,
        current_supervisor_id:current_supervisor_id,
        current_task:current_task,
        current_phase:current_phase,
        current_project_id,current_project_id,
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
  }
  else{
    console.log("else block")
    const resTs = await MatTS.aggregate([
      {
        $match: {
        material_id: material_id,
        current_supervisor_id:current_supervisor_id,
        current_task:current_task,
        current_phase:current_phase,
        current_project_id,current_project_id,
          'timesheets.month': monthstatus,
          tsStatus:"active"
        }
      },
      {
        $project: {
          _id: 1,
          material_id: 1,
          current_supervisor_id: 1,
          current_project_id: 1,
          current_phase_start_date: 1,
          current_phase_end_date: 1,
          current_task:1,
          current_task:1,
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
  // for new days 
const updateTsDays = async (req, res) => {
  // console.log("body",req.body);
  let data =  req.body;
   
  try {
    let material_id  =  new mongoose.Types.ObjectId(data.material_id); 
    let current_supervisor_id = new mongoose.Types.ObjectId(data.current_supervisor_id);
    let current_project_id  = new mongoose.Types.ObjectId(data.current_project_id);
    let current_phase = data.current_phase;
    let current_task = data.current_task;
    console.log(material_id,current_supervisor_id,current_project_id,current_phase,current_task);
    let tsdays = data.timesheets;  
    const ts = await MatTS.findOne({ 
      material_id: material_id,
      current_supervisor_id:current_supervisor_id,
      current_task:current_task,
      current_phase:current_phase,
      current_project_id,current_project_id
    });
    
    console.log("found",ts);
    if (ts){
      MatTS.updateOne(
        { 
          material_id: material_id,
          current_supervisor_id:current_supervisor_id,
          current_task:current_task,
          current_phase:current_phase,
          current_project_id,current_project_id
        }, // Specify the employee to update
        { $push: { timesheets: { $each: tsdays } } } // Add the new objects to the timesheets array
      ).then(result => {
          console.log(result);
          return res.status(200).json({ 
            message: "Eqipment Timesheet saved successfully",
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
const updateTsExistDays = async (req, res) => {
  console.log( req.body);
  let _id  =  req.body.timesheet_id;  
  let dateid = req.body.dateid;
  let datehours = req.body.hoursWorked;
  let daystatus = req.body.status;
  try {
    const ts = await MatTS.findOne({ _id });
    console.log(ts);
    if (ts){
      MatTS.updateOne(
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

//for update ts status
const updateTsStatus = async (req, res) => {
  console.log( req.body);
  let _id  =  req.body.timesheet_id;  
  try {
    const ts = await MatTS.findOne({ _id });
    console.log(ts);
    if (ts){
      MatTS.updateOne(
        { _id: _id }, // Specify the employee to update
        {$set:{tsStatus:req.body.tsStatus} } // Add the new objects to the timesheets array
      ).then(result => {
          console.log(result);
          return res.status(200).json({ 
            message: "Timesheet status updated successfully",
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


module.exports = {
    alive,createTimeSheet,updateTsDays ,getMaterialTs,updateTsExistDays,
    updateTsStatus   
};