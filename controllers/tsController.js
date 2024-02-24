const TimeSheet = require("../models/timesheet");
const mongoose = require('mongoose');

const alive = async(req,res)=>{
    console.log("payroll");
    res.status(500).json("Success");
}

const getTs = async(req,res)=>{
  console.log("get payroll",req.body);
  try{
  const resTs = await TimeSheet.findOne({ _id: new mongoose.Types.ObjectId(req.body._id) })
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


//65d61ac5a55ff08b02d3622b  - ass
//65d5d0660e7dfdb75571711d -jan 
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
              res:result,
              data:ts 
          });
        }).catch(err => {
            console.error(err);
            return res.status(200).json({ 
              message: "Timesheet Error",
              res:err,
              data:ts 
          });
        });        
        //update timesheet trigeers        
      }      
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  module.exports = {
    updateTs,
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