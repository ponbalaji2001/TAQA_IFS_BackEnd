const salesorderSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    order_number: {
      type: String,
      required: true,
    },
    order_id: {
      type: String,
      required: true,
    },
    items: {
      type: String,
      required: true,
    },
    status: {
        type: String,
    },
    

});
  
const SalesOrder = mongoose.model("salesorder", salesorderSchema);
module.exports =  SalesOrder;
