const SalesOrder = require("../models/SalesOrder"); 

// Get all projects data
const getSOList = async (req, res) => {
  try {
    // const allProjects = await Project.find();
    SalesOrder.aggregate([
      {
        $match: {
            status: "Pending"
        }
      },
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
  const filter = { status: "Pending", order_id: req.body.orderid }; // Update YOUR_ORDER_ID with the specific order ID
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

const deleteSOById = async (req, res) => {
  const projectId = req.params.id;
  try {
    const so = await SalesOrder.findByIdAndDelete(projectId);
    if (!so) {
      return res.status(404).json({ message: "Sale Order not found" });
    }
    res.status(200).json({ message: "Sale Order deleted successfully", so });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateSObyId = async (req, res) => {
  const soId = req.params.id;
  const data = req.body;
  try {
    const so = await SalesOrder.findByIdAndUpdate(
      soId,
      {
       name:data.name,
       order_number:data.order_number,
       order_id:data.order_id,
       items:data.items,      
       status:data.status
      },
      { new: true }
    );
    if (!so) {
      return res.status(404).json({ message: "Sale order not found" });
    }
    res.status(200).json({ message: "Sale order updated successfully", so });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const getSOById = async (req, res) => {
  const soId = req.params.id;

  try {
    const so = await SalesOrder.findById(soId)

    if (!so) {
      return res.status(404).json({ error: "ITServices not found" });
    }

    res.status(200).json(so);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getSOList,
  editSODetails,
  deleteSOById,
  updateSObyId,
  getSOById
};