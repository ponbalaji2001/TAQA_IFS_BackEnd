const TimeSheet = require("../models/timesheet");

const alive = async(req,res)=>{
    console.log("payroll");
    res.status(500).json("Success");
}

//65d61ac5a55ff08b02d3622b  - ass
//65d5d0660e7dfdb75571711d -jan 
const updateTs = async (req, res) => {
    // console.log( req.body);
    let data =  req.body;
    let employee_id  =  req.body.employee_id;  
    let yearno = data.timesheets.yearly.years[0].year;  
    let month = data.timesheets.yearly.years[0].months;
    console.log(yearno,month);
    try {
      const ts = await TimeSheet.findOne({ employee_id });
      if (ts){
        // TimeSheet.updateOne(
        //   { employee_id: employee_id }, 
        //   { $push: { 'timesheets.yearly.years[0].months': data.timesheets.yearly.years[0].months },
        //   $set: { 
        //     supervisor_id: data.supervisor_id, // Update supervisor_id
        //     supervisorname: data.supervisorname, // Update supervisorname
        //     //project_id: data.project_id // Update project_id
        //   }
        // }
        // const tsfound = await TimeSheet.findOne({ employee_id });
        
        // this is will update the month values fine
        // TimeSheet.updateOne(
        //   { 
        //     employee_id: employee_id, // Replace YOUR_EMPLOYEE_ID with the specific employee's ObjectId
        //     "timesheets.yearly.years.year": yearno // Replace GIVEN_YEAR with the year you want to match
        //   }, 
        //   { 
        //     $set: { 
        //       "timesheets.yearly.years.$.months": month // Replace YOUR_UPDATED_MONTHS_ARRAY with the updated months array
        //     }
        //   }

        

          // it works and add the month wise timesheet but add duplicated month into month array
          // TimeSheet.updateOne(
          //   { 
          //     employee_id: employee_id,
          //     "timesheets.yearly.years.year": yearno,
          //     "timesheets.yearly.years.months": { $not: { $elemMatch: { month: month.month, monthnumber: month.monthnumber } } }
          //     // "timesheets.yearly.years.months.month.": { $ne: month.month } // Check if the month doesn't already exist
          //   }, 
          //   { 
          //     $addToSet: { // Use $addToSet to add only if the month doesn't already exist
          //       "timesheets.yearly.years.$.months": month
          //     }
          //   }

          // this is also work fine but add duplicates in month
          // TimeSheet.updateOne(
          //   { 
          //     employee_id: employee_id,
          //     "timesheets.yearly.years.year": yearno,
          //     "timesheets.yearly.years.months": { 
          //       $not: { 
          //         $elemMatch: { 
          //           month: { $in: [month.month] },
          //           monthnumber: { $in: [month.monthnumber] }
          //         }
          //       } 
          //     }
          //   }, 
          //   { 
          //     $addToSet: { "timesheets.yearly.years.$.months": month }
          //   } 

          // try to update the month array if month exist now it get matched document but it wont work
          // TimeSheet.updateOne(
          //   { 
          //     employee_id: employee_id,
          //     "timesheets.yearly.years.year": yearno
          //   }, 
          //   { 
          //     $set: { "timesheets.yearly.years.$[outer].months.$[inner]": month }
          //   },
          //   {
          //     arrayFilters: [
          //       { "outer.year": yearno },
          //       { "inner": { $elemMatch: { month: month.month, monthnumber: month.monthnumber } } }
          //     ]
          //   }
                                                                
          // ).then(result => {
          //   console.log(result);
          //   return res.status(200).json({ 
          //     message: "Timesheet saved successfully",
          //     res:result,
          //     data:ts 
          // });
        // }).catch(err => {
        //     console.error(err);
        //     return res.status(200).json({ 
        //       message: "Timesheet Error",
        //       res:err,
        //       data:ts 
        //   });
        // });        
        //update timesheet trigeers
        
      }      
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  
  module.exports = {
    updateTs,
    alive
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