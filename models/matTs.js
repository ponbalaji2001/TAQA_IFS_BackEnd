const mongoose = require("mongoose");

const matDaySchema = new mongoose.Schema({
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

const matTimeSheetSchema = new mongoose.Schema({
  material_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  material_name :{
    type:String,
    required: true
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
   type:[matDaySchema]
  },
  tsStatus:{
    type:String
  },
  createdAt: {
    type: Date,
  },
});

const MatTimeSheet = mongoose.model("matts", matTimeSheetSchema);
module.exports = MatTimeSheet;