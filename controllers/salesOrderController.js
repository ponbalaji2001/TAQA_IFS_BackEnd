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
  const filter = { status: "Pending", order_id: new mongoose.Types.ObjectId(req.body.orderid)}; // Update YOUR_ORDER_ID with the specific order ID
  const update = { status: req.body.status };
  let ordid = req.body.orderid;
  let statusVal = req.body.status;

  SalesOrder.updateOne(filter, { $set: update })
  .then(async result => {
        console.log(result);
        if(statusVal === "Approved"){
            const updateMaster = await updateMasterEquipment(ordid);
            console.log("updated successfully",updateMaster);
            res.status(200).json({ message: "SO updated successfully", result});
        }else{
          res.status(200).json({ message: "SO updated successfully", result});
        }        
  }).catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  });
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
              { $inc: { quantity: -result.totalQuantity } }
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

module.exports = {
  getSOList,
  editSODetails
};