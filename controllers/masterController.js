const EmployeeMaster = require("../models/employee"); 
const EquipmentMaster = require("../models/Equipment");

const alive = async(req,res)=>{
    res.status(500).json("Success");
}
const createEmployee = async (req, res) => {
  try {
    const data= req.body;
    const employee = await EmployeeMaster.create({
      empid:data.empid,
      empname:data.empname,
      desigination:data.designation,
      salary:data.salary
   });
   console.log(employee);
    res.status(200).json({ message: "Employee created successfully",data:employee });
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


module.exports = {
    createEmployee,
    createEquipment,
    alive,
    getEmployeeByName,
    getEquipmentByName
};