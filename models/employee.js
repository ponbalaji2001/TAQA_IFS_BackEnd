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
    first_name: {
        type: String,
        required:true,
    },
    last_name: {
        type: String,
        required:true,
    },
    dob: {
        type: Date,
        required:true,
    },
    gender: {
        type: String,
        required:true,
    },
    designation: {
        type: String,
        required:true,
    },
    role: {
        type: String,
        required:true,
    },
    experience: {
        type: String,
    },
    salary: {
        type: Number,
        required:true,
    },
    category: {
        type: String,
        required:true,
    },
    mobileno: {
        type: String,
        required:true,
    },
    alternate_mobileno: {
        type: String,
    },
   email: {
        type: String,
    },
    address:{
        type: String
    },
    nationalId_type: {
        type: String,
        required:true,
    },
    nationalId_no: {
        type: String,
        required:true,
    },
    emergency_contact: [{

        name: {
            type: String,
        },
        relation: {
            type: String,
        },
        mobileno: {
            type: String,
        },
        email: {
            type: String,
        },
        address: {
            type: String,
        }
    }],
    start_date: {
        type: Date,
    },
    end_date: {
        type: Date
    },
    projects:[{
        project_object_id:{
            type:mongoose.Schema.Types.ObjectId
        },
        project_id: {
            type: Number,
        },
        project_name: {
            type: String,
        },
        project_location: {
            type: String,
        },
    }]    
  });
  
  const EmployeeMaster = mongoose.model("employee", employeeMaster);
  module.exports = EmployeeMaster;
  