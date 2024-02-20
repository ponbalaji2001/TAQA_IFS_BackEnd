const mongoose = require("mongoose");

const timeSheetSchema = new mongoose.Schema({
    "employee_id": {
          type: mongoose.Schema.Types.ObjectId,
          "required": true 
        },
        empid: {
            type: Number,
          },
      "supervisor_id":{
          type: mongoose.Schema.Types.ObjectId,
        },
      "supervisorname": {
          type: String
        },
      "project_id":  {
          type: mongoose.Schema.Types.ObjectId,
        },
    "timesheets": {
      "yearly": {
        "years": [
          {
            "year": {
              "type": Number,
            },            
            "months": [
              {
                "monthnumber":{
                    "type":Number,
                },
                "month": {
                  "type": String,
                },
                "days": [
                  {
                    "day": {
                      "type": Number,
                    },
                    "hours_worked": {
                      "type": Number,
                    },                    
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    "createdAt": {
      "type": Date
    }
  }
  );
  
  const TimeSheet = mongoose.model("timesheet", timeSheetSchema);
  module.exports = TimeSheet;
  