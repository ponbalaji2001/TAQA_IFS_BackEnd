const mongoose = require("mongoose");

const eqdaySchema = new mongoose.Schema({
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

const eqtimeSheetSchema = new mongoose.Schema({
  equipment_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  equipment_name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  current_supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  current_project_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  current_phase: {
    type: Number,
  },
  current_task: {
    type: String,
  },
  current_phase_start_date: {
    type: Date,
  },
  current_phase_end_date: {
    type: Date,
  },
  timesheets: {
   type:[eqdaySchema]
  },
  tsStatus:{
    type:String
  },
  createdAt: {
    type: Date,
  },
});

const EqTimeSheet = mongoose.model("equipts", eqtimeSheetSchema);
module.exports = EqTimeSheet;