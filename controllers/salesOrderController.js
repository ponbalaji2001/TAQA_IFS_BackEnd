const SalesOrder = require("../models/SalesOrder"); 
const EquipmentMaster = require("../models/Equipment");
const Project = require("../models/Project"); 
const mongoose = require('mongoose');


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
            p_id:1,
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
  const filter = {
    status: "Pending",
    order_id: new mongoose.Types.ObjectId(req.body.orderid),
  };

  const update = {
    status: req.body.status
  };
   
  console.log(filter);

  try {
    const updatedOrder = await SalesOrder.findOneAndUpdate(filter, update, { new: true });

    if (!updatedOrder) {
      return res.status(404).json({ error: "SalesOrder not found" });
    }

    if(req.body.status === "Approved"){
      const updateMaster = await updateMasterEquipment(req.body.orderid);
      console.log("updated successfully",updateMaster);
    }
    
    res.status(200).json({ message: "SO updated successfully", updatedOrder});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const updateMasterEquipment = async (orderid)=>{
  try{
    Project.aggregate([
      {
        $match: {
            _id: new mongoose.Types.ObjectId(orderid) 
        }
      },
      { $unwind: "$task" },
      { $unwind: { path: "$task.mls", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$task.mws", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$task.aws", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$task.mps", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$task.mss", preserveNullAndEmptyArrays: true } },
      { $unwind: { path: "$task.mdds", preserveNullAndEmptyArrays: true } },
      { 
        $project: {
          equipment: {
            $concatArrays: [
              "$task.mls.equipment",
              "$task.mws.equipment",
              "$task.aws.equipment",
              "$task.mps.equipment",
              "$task.mss.equipment",
              "$task.mdds.equipment"
            ]
          }
        } 
      },
      { $unwind: "$equipment" },
      { 
        $group: {
          _id: "$equipment.equipmentid",
          totalQuantity: { $sum: { $toInt: "$equipment.quantity" } }
        }
      }
    ]).then(results => {
      console.log("fetched result",results.length);
      console.log(results);
        // results is an array of objects containing _id (equipmentid) and totalQuantity
        // Update master equipment table to reduce quantity
        results.forEach(result => {
            EquipmentMaster.updateOne(
              { equipmentid: result._id },
              { $inc: { quantity: - result.totalQuantity } }
            ).then(() => {
              console.log(`Updated quantity for ${result._id}`);
            }).catch(err => {
              console.error(err);
              // Handle error        
            });
        }); 
      return true;
    }).catch(err => {
        console.error(err);
        return false;
    }); 
  }catch(err){
    console.log("err in updatemaster",err);
  }
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
        p_id:data.p_id,
        issue_date:data.issue_date,
        due_date:data.due_date,
        project_locaton:data.project_location,
        name:data.name,
        order_number:data.order_number,
        order_id:data.order_id,
        items:data.items,
        task_cost:data.task_cost,
        total_manpower_cost:data.total_manpower_cost,
        total_equipment_cost:data.total_equipment_cost,
        total_cost:data.total_cost,
        tax:data.tax,
        amount_due:data.amount_due,
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
      return res.status(404).json({ error: "so not found" });
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