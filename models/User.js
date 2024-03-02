const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
   id: {
     type: Number,
     
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    projects:[{
      
    }],
    assigned_emps:[{
      
    }]
    
  });
  
  const User = mongoose.model("user", userSchema);
  module.exports = User;
  