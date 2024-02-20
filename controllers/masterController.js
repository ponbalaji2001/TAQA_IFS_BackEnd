const EmployeeMaster = require("../models/employee"); 
const EquipmentMaster = require("../models/Equipment");
const Project = require("../models/Project");
const TimeSheet = require("../models/timesheet"); 
const mongoose = require('mongoose');

const alive = async(req,res)=>{
    res.status(500).json("Success");
}
const createEmployee = async (req, res) => {
  try {
    const data= req.body;
    const employee = await EmployeeMaster.create({
      empid:random3DigitNumber(),
      empname:data.empname,
      designation:data.designation,
      experience:data.experience,
      salary:data.salary
   });
   console.log(employee);
   const newTS =  await createTimeSheet(employee);
    res.status(200).json({ message: "Employee created successfully",data:employee,ts:newTS });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

const createEquipment = async (req, res) => {
    try {
      const data= req.body;
      const equipment = await EquipmentMaster.create({
        equipmentid:data.equipmentid,
        name:data.name,
        quantity:data.quantity,
        cost:data.cost,
        specification:data.specification
     });
     console.log(equipment);
      res.status(200).json({ message: "Equipment created successfully",data:equipment });
    } catch (error) {
      console.log(error)
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAllEmployees = async (req, res) => {
    try {
      const allEmp = await EmployeeMaster.find();
      res.status(200).json(allEmp);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  const getAvailEmployees = async (req, res) => {
    try {
      const filter = { projects: { $size: 0 } };
      const filter_emp= await EmployeeMaster.find(filter);
      res.status(200).json(filter_emp);

    } catch (error) {
      console.log(error);
    }
  };

const getEmployeeByName = async(req,res)=>{
    try{
        let searchLetter = req.body.empname;        
        EmployeeMaster.aggregate([
        {
          $match: {
            empname: { $regex: new RegExp(searchLetter, 'i') } // 'i' for case-insensitive search
          }
        }
      ]).then(result => {
        console.log("fetched result",result.length);
        res.status(200).json(result);
      }).catch(err => {
          console.error(err);
      });      
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}


const getEmployeeById = async (req, res) => {
  const empId = req.params.id;

  try {
    const emp = await EmployeeMaster.findById(empId)

    if (!emp) {
      return res.status(404).json({ error: "employee not found" });
    }

    res.status(200).json(emp);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateEmpbyId = async (req, res) => {
  const empId = req.params.id;
  const data = req.body;
  try {
    const emp = await EmployeeMaster.findByIdAndUpdate(
      empId,
      {
        empname:data.empname,
        designation:data.designation,
        experience:data.experience,
        salary:data.salary
      },
      { new: true }
    );
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated successfully", emp });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteEmpById = async (req, res) => {
  const empId = req.params.id;
  try {
    const emp = await EmployeeMaster.findByIdAndDelete(empId);
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully", emp });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

const getEquipmentByName = async(req,res)=>{
    try{
        let searchLetter = req.body.equipname;        
        EquipmentMaster.aggregate([
        {
          $match: {
            name: { $regex: new RegExp(searchLetter, 'i') } // 'i' for case-insensitive search
          }
        }
      ]).then(result => {
        console.log("fetched result",result.length);
        res.status(200).json(result);
      }).catch(err => {
          console.error(err);
      });      
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
}


const updateMasterEquipment = async(req,res)=>{
  

Project.aggregate([
  {
    $match: {
        _id: new mongoose.Types.ObjectId(req.body.orderid) 
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
  res.status(200).json(results);
}).catch(err => {
    console.error(err);
}); 
}


const getAllEquip = async (req, res) => {
  try {
    // const allProjects = await Project.find();
    EquipmentMaster.aggregate([
      {
          $project: {
            equipmentid: 1,
            quantity: 1,
            name: 1,    
            cost:1,
            specification:1,        
            _id: 0 // Excluding _id field
          }
      }
  ]).then(result => {
    console.log("fetched result",result.length);
    res.status(200).json(result);
  }).catch(err => {
      console.error(err);
  });  
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const random3DigitNumber = () => {
  // Generate a random number between 100 and 999
  const randomNumber = Math.floor(Math.random() * 900) + 100;
  return randomNumber.toString();
};

const createTimeSheet = async(details)=>{
  let data = details;
  const currentDate = new Date();
  // Get the current year
  const currentYear = currentDate.getFullYear();
  // Get the current month as a number (0-indexed, where January is 0)
  const currentMonthNumber = currentDate.getMonth();
  // Array of month names
  const monthNames = ["January", "February", "March", "April", "May", "June",
                      "July", "August", "September", "October", "November", "December"];
  // Get the current month name
  const currentMonthName = monthNames[currentMonthNumber];
  // create timeheet trigger
  const newts = await TimeSheet.create({
      employee_id:data._id,
      empid:data.empid,      
      timesheets:{
          yearly:{
              years:[
                  {
                      "year":currentYear,
                      months:[{
                          monthnumber:currentMonthNumber+1,
                          month:currentMonthName,
                          days:[]
                      }]
                  }
              ]
          }
      }
  });
  return newts;
}


module.exports = {
    createEmployee,
    createEquipment,
    alive,
    getEmployeeByName,
    getEquipmentByName,
    updateMasterEquipment,
    getAllEquip,
    getAllEmployees,
    updateEmpbyId,
    deleteEmpById,
    getAvailEmployees,
    getEmployeeById,
};