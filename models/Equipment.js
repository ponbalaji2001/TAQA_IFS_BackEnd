const mongoose = require("mongoose");

const equipmentMaster = new mongoose.Schema({
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
  });
  
  const EquipmentMaster = mongoose.model("equipment", equipmentMaster);
  module.exports = EquipmentMaster;
  