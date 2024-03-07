const EquipTs = require("../models/EquipTs");
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
      const newts = await EquipTs.create({
        eqipment_id: data.equipment_id,
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
        message: "Equip Ts created successfully",       
      });
    } catch (err) {
      console.log("While ts creating ", err);
      res.status(500).json({
        message: "Internal Server Error",       
      });
    }
  }

const getEquipmentTs = async(req,res)=>{
  console.log("get payroll",req.body);
  let data = req.body;
  try{
    let monthstatus = req.body.month;
    let equipment_id  =  new mongoose.Types.ObjectId(data.equipment_id); 
    let current_supervisor_id = new mongoose.Types.ObjectId(data.current_supervisor_id);
    let current_project_id  = new mongoose.Types.ObjectId(data.current_project_id);
    let current_phase = data.current_phase;
    let current_task = data.current_task;
    console.log(equipment_id,current_supervisor_id,current_project_id,current_phase,current_task);

    if(monthstatus === "all"){   
      const resTs = await EquipTs.findOne({ 
        equipment_id: equipment_id,
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
    const resTs = await EquipTs.aggregate([
      {
        $match: {
        equipment_id: equipment_id,
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
          equipment_id: 1,
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
    let equipment_id  =  new mongoose.Types.ObjectId(data.equipment_id); 
    let current_supervisor_id = new mongoose.Types.ObjectId(data.current_supervisor_id);
    let current_project_id  = new mongoose.Types.ObjectId(data.current_project_id);
    let current_phase = data.current_phase;
    let current_task = data.current_task;
    console.log(equipment_id,current_supervisor_id,current_project_id,current_phase,current_task);
    let tsdays = data.timesheets;  
    const ts = await EquipTs.findOne({ 
      equipment_id: equipment_id,
      current_supervisor_id:current_supervisor_id,
      current_task:current_task,
      current_phase:current_phase,
      current_project_id,current_project_id
    });
    
    console.log("found",ts);
    if (ts){
      EquipTs.updateOne(
        { 
          equipment_id: equipment_id,
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
    const ts = await EquipTs.findOne({ _id });
    console.log(ts);
    if (ts){
      EquipTs.updateOne(
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
    const ts = await EquipTs.findOne({ _id });
    console.log(ts);
    if (ts){
      EquipTs.updateOne(
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
    alive ,createTimeSheet  , updateTsDays,getEquipmentTs,updateTsStatus,
    updateTsExistDays
};