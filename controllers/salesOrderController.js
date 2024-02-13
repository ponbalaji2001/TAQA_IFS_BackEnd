const SalesOrder = require("../models/SalesOrder"); 

const createSaleOrder = async (req, res) => {
  try {
    const data =req.body;
    const salesorder =await SalesOrder.create({
      name:data.name,
      order_number:data.order_number,
      order_id:data.order_id,
      items:data.items,
      status:data.status,
    });
    res.status(200).json({ message: "Project created successfully", salesorder});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
