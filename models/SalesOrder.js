const mongoose = require("mongoose");

const salesorderSchema = new mongoose.Schema({
   p_id: {
    type: Number,
    required: true,
   },
   issue_date: {
    type: Date,
    required: true,
  }, 
  due_date: {
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
    phases:[{   
    
    }],
   all_manpower:[{   
    
   }],
   all_equipment:[{   
    
   }],
   all_material:[{   
    
   }],
    total_manpower_cost: {
        type: Number,
        required: true,
    },
    total_equipment_cost: {
      type: Number,
      required: true,
    },
    total_material_cost: {
      type: Number,
      required: true,
    },
    tax: {
        type: Number,
        required: true,
    }, 
    total_cost: {
        type: Number,
        required: true,
    },
    amount_due: {
        type: Number,
        required: true,
    },
    project_location:{
      type:String,
      required:true
    }       
  

});
  
const SalesOrder = mongoose.model("salesorder", salesorderSchema);
module.exports =  SalesOrder;
