const SalesOrder = require("../models/SalesOrder"); 

// Get all projects data
const getSOList = async (req, res) => {
  try {
    // const allProjects = await Project.find();
    SalesOrder.aggregate([
      {
          $project: {
            name:1,
            order_number:1,
            order_id:1,
            items:1,
            status:1,
            _id: 1
          }
      }
  ]).then(result => {
    console.log("fetched result",result.length);
    res.status(200).json({ message: "SO fetched successfully", result});
  }).catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const editSODetails = async(req,res)=>{ 
  const filter = { status: "Pending", order_id: req.body.id }; // Update YOUR_ORDER_ID with the specific order ID
  const update = { status: req.body.status };
  SalesOrder.updateOne(filter, { $set: update })
  .then(result => {
        console.log(result);
        res.status(200).json({ message: "SO updated successfully", result});
  }).catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  });
}

module.exports = {
  getSOList,
  editSODetails
};