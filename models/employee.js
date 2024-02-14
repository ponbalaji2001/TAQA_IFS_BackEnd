const mongoose = require("mongoose");

const employeeMaster = new mongoose.Schema({
    empid: {
      type: String,
    },
    empname: {
        type: String,
    },
    desigination: {
        type: String,
    },
    salary: {
        type: String,
    }    
  });
  
  const EmployeeMaster = mongoose.model("employee", employeeMaster);
  module.exports = EmployeeMaster;
  