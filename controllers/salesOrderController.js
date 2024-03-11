const SalesOrder = require("../models/SalesOrder"); 
const EquipmentMaster = require("../models/Equipment");
const Project = require("../models/Project"); 
const mongoose = require('mongoose');
const MaterialsMaster =  require("../models/materials");

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
            createdby:1,
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

const filterSOList = async (req, res) => {
    
    const data=req.body;
    const sort_order =  parseInt(data.sortType, 10) || 1;

    SalesOrder.aggregate([
      {
        $match: {

          $and:[
            data.createdAt && data.createdAt_filter === "gte" ? { "createdby.date" : { $gte: new Date(data.createdAt) } } : {},
            data.createdAt && data.createdAt_filter === "gt" ? { "createdby.date" : { $gt: new Date(data.createdAt) } } : {},
            data.createdAt && data.createdAt_filter === "lte" ? { "createdby.date" : { $lte: new Date(data.createdAt) } } : {},
            data.createdAt && data.createdAt_filter === "lt" ? { "createdby.date" : { $lt: new Date(data.createdAt) } } : {},
            data.createdAt && data.createdAt_filter === "eq" ? { "createdby.date" : { $eq: new Date(data.createdAt) } } : {},
            data.createdBy ? { "createdby.name" : data.createdBy } : {},
            { status: "Pending" }
          ]
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
            createdby:1,
            _id: 1
          }
      },
      { 
        $sort: { [data.sortBy]: sort_order } 
      }
  ]).then(result => {
    console.log("fetched result",result.length);
    res.status(200).json({ message: "SO fetched successfully", result});
  }).catch(err => {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
  });  
 
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
      const updateMasterMaterial = await updateMasterMaterials(req.body.orderid);
      // console.log("updated successfully",updateMasterMaterial);
      console.log("updated successfully",updateMaster);
    }
    
    res.status(200).json({ message: "SO updated successfully", data:updatedOrder});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


const updateMasterEquipment = async (orderid)=>{
  try{ 
      
      SalesOrder.aggregate([
        {
          $match: {
            order_id: new mongoose.Types.ObjectId(orderid) 
          }
        },
        {
          $unwind: "$all_equipment"
        },
        {
          $group: {
            _id: "$all_equipment.equipmentid",
            totalcount: { $sum: "$all_equipment.quantity" }
          }
        },
        {
          $project: {
            _id: 0, // Exclude the default _id field
            equipmentid: "$_id",
            totalcount: 1
          }
        }
      ]).then(results => {
      console.log("fetched result",results.length);
      console.log(results);
        // results is an array of objects containing _id (equipmentid) and totalQuantity
        // Update master equipment table to reduce quantity
        results.forEach(result => {
            EquipmentMaster.updateOne(
              { equipmentid: result.equipmentid },
              { $inc: { quantity: - result.totalcount } }
            ).then((resultset) => {
              // console.log(resultset);
              console.log(`Updated quantity for ${result._id}`);
            }).catch(err => {
              console.error("error",err);
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

const updateMasterMaterials = async (orderid)=>{
  try{
    SalesOrder.aggregate([
      {
        $match: {
          order_id: new mongoose.Types.ObjectId(orderid) 
        }
      },
      {
        $unwind: "$all_materials"
      },
      {
        $group: {
          _id: "$all_materials.materialid",
          totalcount: { $sum: "$all_materials.quantity" }
        }
      },
      {
        $project: {
          _id: 0, // Exclude the default _id field
          materialid: "$_id",
          totalcount: 1
        }
      }
    ]).then(results => {
      console.log("fetched result",results.length);
      console.log(results);
        // results is an array of objects containing _id (equipmentid) and totalQuantity
        // Update master equipment table to reduce quantity
        results.forEach(result => {
          MaterialsMaster.updateOne(
              { materialid: result.materialid },
              { $inc: { quantity: - result.totalcount } }
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
  getSOById,
  filterSOList
};