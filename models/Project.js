const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    assignee: {
      type: String,
      required: true,
    },
    reporter: {
      type: String,
      required: true,
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
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          experience: {
            type: Number,
          },
          salary: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

        equipment:[{
          name: {
            type: String,
          },
          size: {
            type: String,
          },
          experience:{
            type: Number,
          },
          cost: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

      }],
      mws:[{
         
        man_power:[{
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          experience: {
            type: Number,
          },
          salary: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

        equipment:[{
          name: {
            type: String,
          },
          size: {
            type: String,
          },
          experience:{
            type: Number,
          },
          cost: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],
        
      }],
      aws:[{
        man_power:[{
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          experience: {
            type: Number,
          },
          salary: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

        equipment:[{
          name: {
            type: String,
          },
          size: {
            type: String,
          },

          experience:{
            type: Number,
          },
          cost: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

      }],
      mps:[{
        man_power:[{
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          experience: {
            type: Number,
          },
          salary: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

        equipment:[{
          name: {
            type: String,
          },
          size: {
            type: String,
          },
          experience:{
            type: Number,
          },
          cost: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],
      }],
      mss:[{
        man_power:[{
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          experience: {
            type: Number,
          },
          salary: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

        equipment:[{
          name: {
            type: String,
          },
          size: {
            type: String,
          },
          experience:{
            type: Number,
          },
          cost: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],
      }],
      mdds:[{
        man_power:[{
          name: {
            type: String,
          },
          role: {
            type: String,
          },
          experience: {
            type: Number,
          },
          salary: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],

        equipment:[{
          name: {
            type: String,
          },
          size: {
            type: String,
          },

          experience:{
            type: Number,
          },
          cost: {
            type: Number,
          },
          work_hours: {
            type: Number,
          },
        }],
      }],
    }]
    
  });
  
  const Project = mongoose.model("project", projectSchema);
  module.exports = Project;
  