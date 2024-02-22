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
  supervisor_id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  supervisorname: {
    type: String,
  },
  project_id: {
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
      ],
    },
  },
  createdAt: {
    type: Date,
  },
});

const TimeSheet = mongoose.model("timesheet", timeSheetSchema);
module.exports = TimeSheet;
