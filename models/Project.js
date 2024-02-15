const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
      type: String,
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
      required: true,
    },
    description: {
      type: String,
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
    task:[{
      mls:[{
        man_power:[{
          empid: {
            type: String,
          },
          empname: {
              type: String,
          },
          desigination: {
              type: String,
          },
          experience: {
              type: String,
          },   
          duration: {
            type: Number,
          },
        }],
        equipment:[{
          equipmentid: {
            type: String,
          },
          name: {
              type: String,
          },
          quantity: {
              type: Number,
          },
          cost: {
              type: String,
          },
          specification: {
              type: String,
          },
        }],
      }],
      mws:[{
         
        man_power:[{
          empid: {
            type: String,
          },
          empname: {
              type: String,
          },
          desigination: {
              type: String,
          },
          experience: {
              type: String,
          },   
          duration: {
            type: Number,
          },
        }],

        equipment:[{
          equipmentid: {
            type: String,
          },
          name: {
              type: String,
          },
          quantity: {
              type: Number,
          },
          cost: {
              type: String,
          },
          specification: {
              type: String,
          },
        }],
        
      }],
      aws:[{
        man_power:[{
          empid: {
            type: String,
          },
          empname: {
              type: String,
          },
          desigination: {
              type: String,
          },
          experience: {
              type: String,
          },   
          duration: {
            type: Number,
          },
        }],

        equipment:[{
          equipmentid: {
            type: String,
          },
          name: {
              type: String,
          },
          quantity: {
              type: Number,
          },
          cost: {
              type: String,
          },
          specification: {
              type: String,
          },
        }],

      }],
      mps:[{
        man_power:[{
          empid: {
            type: String,
          },
          empname: {
              type: String,
          },
          desigination: {
              type: String,
          },
          experience: {
              type: String,
          },   
          duration: {
            type: Number,
          },
        }],

        equipment:[{
          equipmentid: {
            type: String,
          },
          name: {
              type: String,
          },
          quantity: {
              type: Number,
          },
          cost: {
              type: String,
          },
          specification: {
              type: String,
          },
        }],
      }],
      mss:[{
        man_power:[{
          empid: {
            type: String,
          },
          empname: {
              type: String,
          },
          desigination: {
              type: String,
          },
          experience: {
              type: String,
          },   
          duration: {
            type: Number,
          },
        }],

        equipment:[{
          equipmentid: {
            type: String,
          },
          name: {
              type: String,
          },
          quantity: {
              type: Number,
          },
          cost: {
              type: String,
          },
          specification: {
              type: String,
          },
        }],
      }],
      mdds:[{
        man_power:[{
          empid: {
            type: String,
          },
          empname: {
              type: String,
          },
          desigination: {
              type: String,
          },
          experience: {
              type: String,
          },   
          duration: {
            type: Number,
          },
        }],

        equipment:[{
          equipmentid: {
            type: String,
          },
          name: {
              type: String,
          },
          quantity: {
              type: Number,
          },
          cost: {
              type: String,
          },
          specification: {
              type: String,
          },
        }],
      }],
    }]
    
  });
  
  const Project = mongoose.model("project", projectSchema);
  module.exports = Project;
  