const mongoose = require("mongoose");

const employeeMaster = new mongoose.Schema({
    empid: {
      type: String,
    },
    empname: {
        type: String,
    },
    designation: {
        type: String,
    },
    experience: {
        type: String,
    }    
  });
  
  const EmployeeMaster = mongoose.model("employee", employeeMaster);
  module.exports = EmployeeMaster;
  