const mongoose = require("mongoose");

const salesorderSchema = new mongoose.Schema({
   p_id: {
    type: String,
    required: true,
   },
   issue_date: {
    type: Date,
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
      type: Number,
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
