const TimeSheet = require("../models/timesheet");
const mongoose = require('mongoose');

const alive = async(req,res)=>{
    console.log("payroll");
    res.status(500).json("Success");
}

const getTs = async(req,res)=>{
  console.log("get payroll",req.body);
  try{
  const resTs = await TimeSheet.findOne({ 
    _id: new mongoose.Types.ObjectId(req.body._id),
    tsStatus:"active"
   })
  .then(timesheet => {
    if (timesheet) {
      // Timesheet document found, you can use it here
      console.log(timesheet);
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
  });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}



const updateTs = async (req, res) => {
    console.log( req.body.length);
    let data =  req.body;
    let employee_id  =  req.body.employee_id; 
    let tsdays = data.timesheets;   
    try {
      const ts = await TimeSheet.findOne({ employee_id });
      console.log(ts);
      if (ts){
        TimeSheet.updateOne(
          { employee_id: employee_id }, // Specify the employee to update
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


  
  module.exports = {
    updateTs,
    updateTsStatus,
    updateTsDays,
    alive,
    getTs
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