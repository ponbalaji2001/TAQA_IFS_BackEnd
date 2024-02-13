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
        amount_due:data.total
     });
     
      res.status(200).json({ message: "User created successfully", user });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" });
    }
  };
  
  module.exports = {
    createProject,
    getAllProjects,
    getAllProjectsList
  };