const mongoose = require("mongoose");

const employeeMaster = new mongoose.Schema({
    empid: {
      type: Number,
      required:true,
    },
    empname: {
        type: String,
        required:true,
    },
    designation: {
        type: String,
        required:true,
    },
    experience: {
        type: String,
        required:true,
    },
    salary: {
        type: Number,
        required:true,
    },
    projects:[{
        project_id: {
            type: Number,
        },
        project_location: {
            type: String,
        },
    }]    
  });
  
  const EmployeeMaster = mongoose.model("employee", employeeMaster);
  module.exports = EmployeeMaster;
  