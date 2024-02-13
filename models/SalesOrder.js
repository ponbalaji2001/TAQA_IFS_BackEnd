const mongoose = require("mongoose");

const salesorderSchema = new mongoose.Schema({
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
    

});
  
const SalesOrder = mongoose.model("salesorder", salesorderSchema);
module.exports =  SalesOrder;
