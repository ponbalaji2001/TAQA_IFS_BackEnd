const mongoose = require("mongoose");

//for refernce timesheet
const timeSheetSchema = new mongoose.Schema({
    employee_id: {
          type: mongoose.Schema.Types.ObjectId,
          "required": true 
    },
    empid: {
        type: Number,
      },
    supervisor_id:{
        type: mongoose.Schema.Types.ObjectId,
      },
    supervisorname: {
        type: String
      },
    project_id:  {
        type: mongoose.Schema.Types.ObjectId,
    },
    timesheets: {
      yearly: {
        years: [
          {
            year: {
              type: Number,
            },            
            months: [
              {
                monthnumber:{
                    type:Number,
                },
                month: {
                  type: String,
                },
                weeks:[]                
              }
            ]
          }
        ]
      }
    },
    createdAt: {
      type: Date
    }
  }
  );
  
 //for refernce timesheet
  
  
  const TimeSheet = mongoose.model("timesheet", timeSheetSchema);
//   module.exports = TimeSheet;
  
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