const mongoose = require("mongoose");

const materials = new mongoose.Schema({
    materialid: {
      type: String,
    },
    materialname: {
        type: String,
    },
    quantity: {
        type: Number,
    },
    unit:{
        type:String
    },
    cost: {
        type: Number,
    },
    specification: {
        type: String,
    },    
  });
  
  const MaterialsMaster = mongoose.model("materials", materials);
  module.exports = MaterialsMaster;
  