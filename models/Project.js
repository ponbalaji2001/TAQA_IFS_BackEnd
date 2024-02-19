const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    pid: {
      type: Number,
      required: true,
    },
    assignee: {
      type: String,      
    },
    reporter: {
      type: String,
    },
    location: {
      type: String, 
      required: true,
      
    },
    priority: {
      type: String,
      
    },
    description: {
      type: String,
      required: true,
    },
    start_date: {
      type: Date,
      required: true,
     
    },
    end_date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
    },
    phases:[{

      phase_start:{
        type: Date,
        required: true,
      },
      phase_end:{
        type: Date,
        required: true,
      },

      tasks:[{
    //   mls:[{
    //     supervisor:{
    //       supervisor_id:{
    //         type:Number,
    //       },
    //       supervisor_name:{
    //         type:String,
    //       }
    //     },
    //     man_power:[{
    //       empid: {
    //         type: String,
    //       },
    //       empname: {
    //           type: String,
    //       },
    //       designation: {
    //           type: String,
    //       },
    //       experience: {
    //           type: String,
    //       }, 
    //      salary: {
    //         type: Number,
    //       },  
    //       duration: {
    //         type: Number,
    //       },
    //     }],
    //     equipment:[{
    //       equipmentid: {
    //         type: String,
    //       },
    //       name: {
    //           type: String,
    //       },
    //       quantity: {
    //           type: Number,
    //       },
    //       cost: {
    //           type: Number,
    //       },
    //       specification: {
    //           type: String,
    //       },
    //     }],
    //   }],
    //   mws:[{

    //     supervisor:{
    //       supervisor_id:{
    //         type:Number,
    //       },
    //       supervisor_name:{
    //         type:String,
    //       }
    //     },
         
    //     man_power:[{
    //       empid: {
    //         type: String,
    //       },
    //       empname: {
    //           type: String,
    //       },
    //       designation: {
    //           type: String,
    //       },
    //       experience: {
    //           type: String,
    //       },
    //       salary: {
    //         type: Number,
    //       },   
    //       duration: {
    //         type: Number,
    //       },
    //     }],

    //     equipment:[{
    //       equipmentid: {
    //         type: String,
    //       },
    //       name: {
    //           type: String,
    //       },
    //       quantity: {
    //           type: Number,
    //       },
    //       cost: {
    //           type: Number,
    //       },
    //       specification: {
    //           type: String,
    //       },
    //     }],
        
    //   }],
    //   aws:[{
    //     supervisor:{
    //       supervisor_id:{
    //         type:Number,
    //       },
    //       supervisor_name:{
    //         type:String,
    //       }
    //     },

    //     man_power:[{
    //       empid: {
    //         type: String,
    //       },
    //       empname: {
    //           type: String,
    //       },
    //       designation: {
    //           type: String,
    //       },
    //       experience: {
    //           type: String,
    //       },
    //       salary: {
    //         type: Number,
    //       },   
    //       duration: {
    //         type: Number,
    //       },
    //     }],

    //     equipment:[{
    //       equipmentid: {
    //         type: String,
    //       },
    //       name: {
    //           type: String,
    //       },
    //       quantity: {
    //           type: Number,
    //       },
    //       cost: {
    //           type: Number,
    //       },
    //       specification: {
    //           type: String,
    //       },
    //     }],

    //   }],
    //   mps:[{
    //     supervisor:{
    //       supervisor_id:{
    //         type:Number,
    //       },
    //       supervisor_name:{
    //         type:String,
    //       }
    //     },

    //     man_power:[{
    //       empid: {
    //         type: String,
    //       },
    //       empname: {
    //           type: String,
    //       },
    //       designation: {
    //           type: String,
    //       },
    //       experience: {
    //           type: String,
    //       },
    //       salary: {
    //         type: Number,
    //       },   
    //       duration: {
    //         type: Number,
    //       },
    //     }],

    //     equipment:[{
    //       equipmentid: {
    //         type: String,
    //       },
    //       name: {
    //           type: String,
    //       },
    //       quantity: {
    //           type: Number,
    //       },
    //       cost: {
    //           type: Number,
    //       },
    //       specification: {
    //           type: String,
    //       },
    //     }],
    //   }],
    //   mss:[{
    //     supervisor:{
    //       supervisor_id:{
    //         type:Number,
    //       },
    //       supervisor_name:{
    //         type:String,
    //       }
    //     },

    //     man_power:[{
    //       empid: {
    //         type: String,
    //       },
    //       empname: {
    //           type: String,
    //       },
    //       designation: {
    //           type: String,
    //       },
    //       experience: {
    //           type: String,
    //       },
    //       salary: {
    //         type: Number,
    //       },   
    //       duration: {
    //         type: Number,
    //       },
    //     }],

    //     equipment:[{
    //       equipmentid: {
    //         type: String,
    //       },
    //       name: {
    //           type: String,
    //       },
    //       quantity: {
    //           type: Number,
    //       },
    //       cost: {
    //           type: Number,
    //       },
    //       specification: {
    //           type: String,
    //       },
    //     }],
    //   }],
    //   mdds:[{
    //     supervisor:{
    //       supervisor_id:{
    //         type:Number,
    //       },
    //       supervisor_name:{
    //         type:String,
    //       }
    //     },
        
    //     man_power:[{
    //       empid: {
    //         type: String,
    //       },
    //       empname: {
    //           type: String,
    //       },
    //       designation: {
    //           type: String,
    //       },
    //       experience: {
    //           type: String,
    //       },
    //       salary: {
    //         type: Number,
    //       },   
    //       duration: {
    //         type: Number,
    //       },
    //     }],

    //     equipment:[{
    //       equipmentid: {
    //         type: String,
    //       },
    //       name: {
    //           type: String,
    //       },
    //       quantity: {
    //           type: Number,
    //       },
    //       cost: {
    //           type: Number,
    //       },
    //       specification: {
    //           type: String,
    //       },
    //     }],
    //   }],
    }]

  }]

  });
  
  const Project = mongoose.model("project", projectSchema);
  module.exports = Project;
  