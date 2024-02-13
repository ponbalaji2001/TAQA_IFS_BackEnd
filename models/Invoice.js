const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema({
    issued_date: {
      type: Date,
    },
    due_date: {
      type: Date,
      
    },
    billed_to: {
      type: String,
     
    },
    from: {
      type: String,
      
    },    
    service:[{

    }],
    sub_total: {
        type: Number,
        required: true,
    },
    tax: {
          type: Number,
          required: true,
    }, 
    total: {
        type: Number,
        required: true,
    },
    amount_due: {
        type: Number,
        required: true,
    },        

});
  
const Invoice = mongoose.model("invoice", invoiceSchema);
module.exports =  Invoice;
