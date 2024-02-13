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
            _id: 0 // Excluding _id field
          }
      }
  ]).then(result => {
    console.log("fetched result",result.length);
    res.status(200).json({ message: "SO fetched successfully", result});
  }).catch(err => {
      console.error(err);
  });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSOList
};