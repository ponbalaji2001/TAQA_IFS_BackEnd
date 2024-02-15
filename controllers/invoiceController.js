const Invoice = require("../models/Invoice");
const createInvoice = async (req, res) => {
    try {
      const data= req.body;
      const invoice = await Invoice.create({
        issued_date:data.issued_date,
        due_date:data.due_date,
        billed_to:data.billed_to,
        from:data.from,
        service:data.service,
        sub_total:data.sub_total,
        tax:data.tax,
        total:data.total,
        amount_due:data.amount_due,
     });
     
      res.status(200).json({ message: "invoice created successfully", invoice});
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  const getAllInvoices = async (req, res) => {
    try {
      const allInvoices = await Invoice.find()
      res.status(200).json(allInvoices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  module.exports = {
    createInvoice,
    getAllInvoices
  };