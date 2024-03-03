const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  dayno: {
    type: Number,
  },
  day:{
    type:String
  },
  month:{
    type:String
  },
  year:{
    type:Number
  },
  hoursWorked: {
    type: Number,
  },
  status:{
    type:String
  },
  task:{
    type:String
  },  
});

const timeSheetSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  empid: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  current_supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  current_project_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  current_phase_start_date: {
    type: Date,
  },
  current_phase_end_date: {
    type: Date,
  },
  timesheets: {
   type:[daySchema]
  },
  tsStatus:{
    type:String
  },
  createdAt: {
    type: Date,
  },
});

const TimeSheet = mongoose.model("timesheets", timeSheetSchema);
module.exports = TimeSheet;