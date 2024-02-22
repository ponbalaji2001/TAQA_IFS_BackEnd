const mongoose = require("mongoose");

const daySchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  day: {
    type: Number,
  },
  hoursWorked: {
    type: Number,
  },
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  project_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const weekSchema = new mongoose.Schema({
  week: {
    type: [daySchema],
  },
});

const timeSheetSchema = new mongoose.Schema({
  employee_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  empid: {
    type: Number,
  },
  current_supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  current_project_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  timesheets: {
    years: [
      {
        year: {
          type: Number,
        },
        months: [
          {
            monthnumber: {
              type: Number,
            },
            month: {
              type: String,
            },
            weeks: {
              type: [weekSchema],
            },
          },
        ],
      },
    ]
  },
  createdAt: {
    type: Date,
  },
});

const TimeSheet = mongoose.model("newTs", timeSheetSchema);
module.exports = TimeSheet;
