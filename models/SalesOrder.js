const mongoose = require("mongoose");

const salesorderSchema = new mongoose.Schema({
   p_id: {
    type: String,
    required: true,
   },
    name: {
      type: String,
      required: true,
    },
    order_number: {
      type: Number,
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    items: {
      type: Number,
      required: true,
    },
    status: {
        type: String,
    },
    task_cost:[{   
      mls:[{}], 
      mws:[{}], 
      aws:[{}],
      mps:[{}],
      mss:[{}], 
      mis:[{}], 
      mdds:[{}]
   }],
    total_manpower_cost: {
        type: Number,
        required: true,
    },
    total_equipment_cost: {
      type: Number,
      required: true,
    },
    tax: {
        type: Number
    }, 
    total_cost: {
        type: Number,
        required: true,
    },
    amount_due: {
        type: Number,
    },        
  

});
  
const SalesOrder = mongoose.model("salesorder", salesorderSchema);
module.exports =  SalesOrder;
