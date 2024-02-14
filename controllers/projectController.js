const Project = require("../models/Project"); 
const SalesOrder = require("../models/SalesOrder"); 
const mongoose = require('mongoose');


//Create project
const createProject = async (req, res) => {
  try {
    const data =req.body;
    const project =await Project.create({
      title:data.title,
      assignee:data.assignee,
      reporter:data.reporter,
      location:data.location,
      priority:data.priority,
      description:data.description,
      start_date:data.start_date,
      end_date:data.end_date,
      status:data.status,
      task:data.task      
    });

  let totalManpowerCost = 0;
  let totalEquipmentCost = 0;
  let mls_mp_cost=0;
  let mls_eq_cost=0;
  let mws_mp_cost=0;
  let mws_eq_cost=0;
  let aws_mp_cost=0;
  let aws_eq_cost=0;
  let mps_mp_cost=0;
  let mps_eq_cost=0;
  let mss_mp_cost=0;
  let mss_eq_cost=0;
  let mis_mp_cost=0;
  let mis_eq_cost=0;
  let mdds_mp_cost=0;
  let mdds_eq_cost=0;
  let total_cost=0;
  

if (data.task) {
  data.task.forEach(taskType => {
    taskType.mls?.forEach(ml => {
      ml.man_power?.forEach(mp => {
        mls_mp_cost += mp.salary;
      });
      ml.equipment?.forEach(eq => {
        mls_eq_cost += eq.cost;
      });
    });

    taskType.mws?.forEach(aw => {
      aw.man_power?.forEach(mp => {
        mws_mp_cost += mp.salary;
      });
      aw.equipment?.forEach(eq => {
        mws_eq_cost += eq.cost;
      });
    }); 


    taskType.aws?.forEach(aw => {
      aw.man_power?.forEach(mp => {
        aws_mp_cost += mp.salary;
      });
      aw.equipment?.forEach(eq => {
        aws_eq_cost += eq.cost;
      });
    });

    taskType.mps?.forEach(aw => {
      aw.man_power?.forEach(mp => {
        mps_mp_cost += mp.salary;
      });
      aw.equipment?.forEach(eq => {
        mps_eq_cost += eq.cost;
      });
    });

    taskType.mss?.forEach(aw => {
      aw.man_power?.forEach(mp => {
         mss_mp_cost += mp.salary;
      });
      aw.equipment?.forEach(eq => {
        mss_eq_cost += eq.cost;
      });
    });

    taskType.mis?.forEach(aw => {
      aw.man_power?.forEach(mp => {
         mis_mp_cost += mp.salary;
      });
      aw.equipment?.forEach(eq => {
        mis_eq_cost += eq.cost;
      });
    });

    taskType.mdds?.forEach(aw => {
      aw.man_power?.forEach(mp => {
        mdds_mp_cost += mp.salary;
      });
      aw.equipment?.forEach(eq => {
        mdds_eq_cost += eq.cost;
      });
    });
   
  });
}
  
  totalManpowerCost=mls_mp_cost+mws_mp_cost+aws_mp_cost+mps_mp_cost+mss_mp_cost+mis_mp_cost+mdds_mp_cost;
  totalEquipmentCost=mls_eq_cost+mws_eq_cost+aws_eq_cost+mps_eq_cost+mss_eq_cost+mis_mp_cost+mdds_eq_cost;
  total_cost=totalManpowerCost+totalEquipmentCost;
  console.log(totalManpowerCost+" "+totalEquipmentCost);
    
    let ordDetails = {
      p_id:project._id,
      name:data.title,
      order_number:random8DigitNumber(),
      order_id:random7DigitNumber(),
      items:itemRandomNumber(),
      task_cost:[{
        mls:[{
          mls_manpower_cost:mls_mp_cost,
          mls_equipment_cost:mls_eq_cost,
        }], 
        mws:[{
          mws_manpower_cost:mws_mp_cost,
          mws_equipment_cost:mws_eq_cost,
        }], 
        aws:[{
          aws_manpower_cost:aws_mp_cost,
          aws_equipment_cost:aws_eq_cost,
        }],
        mps:[{
          mps_manpower_cost:mps_mp_cost,
          mps_equipment_cost:mps_eq_cost,
        }],
        mss:[{
          mss_manpower_cost:mss_mp_cost,
          mss_equipment_cost:mss_eq_cost,
        }], 
        mis:[{
          mis_manpower_cost:mis_mp_cost,
          mis_equipment_cost:mis_eq_cost,
        }], 
        mdds:[{
          mdds_manpower_cost:mdds_mp_cost,
          mdds_equipment_cost:mdds_eq_cost,
        }]
      }],
      total_manpower_cost:totalManpowerCost,
      total_equipment_cost:totalEquipmentCost, 
      total_cost:total_cost,     
      status:"Pending"
    }
    const cso = await createSaleOrder(ordDetails);
    console.log("cso worked",cso);
    res.status(200).json({ message: "Project created successfully", project,"OrderCreated":cso});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createSaleOrder = async (productDetails) => {
  try {
    const data =productDetails;
    const salesorder =await SalesOrder.create({
      p_id:data.p_id,
      name:data.name,
      order_number:data.order_number,
      order_id:data.order_id,
      items:data.items,
      task_cost:data.task_cost,
      total_manpower_cost:data.total_manpower_cost,
      total_equipment_cost:data.totalEquipmentCost,
      total_cost:data.total_cost,
      status:data.status
    });
    return true;
    // res.status(200).json({ message: "Project created successfully", salesorder});
  } catch (error) {
    console.log(error);
    return false;
    // res.status(500).json({ message: "Internal server error" });
  }
};


// Get all projects data
const getProjectById = async (req, res) => {
  try {
    // const allProjects = await Project.find()
    Project.aggregate([
      {
        $match: {
            _id: new mongoose.Types.ObjectId(req.body.id) 
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

// Get all projects data
const getAllProjectsList = async (req, res) => {
  try {
    // const allProjects = await Project.find();
    Project.aggregate([
      {
          $project: {
              title: 1,
              assignee: 1,
              status: 1,
              start_date: 1,
              end_date: 1,
              _id: 1 // Excluding _id field
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

const updateProjectbyId = async (req, res) => {
  const projectId = req.params.id;
  const data = req.body;
  try {
    const project = await Project.findByIdAndUpdate(
      projectId,
      {
        title:data.title,
        assignee:data.assignee,
        reporter:data.reporter,
        location:data.location,
        priority:data.priority,
        description:data.description,
        start_date:data.start_date,
        end_date:data.end_date,
        status:data.status,
        task:data.task    
      },
      { new: true }
    );
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
}

const deleteProjectById = async (req, res) => {
  const projectId = req.params.id;
  console.log("project id", projectId)

  try {
    const project = await Project.findByIdAndDelete(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully", project });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};


const random8DigitNumber=()=> {
  
  let randomNumber = Math.floor(Math.random() * 100000000);
  
  let randomString = randomNumber.toString();
  
  while (randomString.length < 8) {
    randomString = '0' + randomString;
  }
  return randomString;
}

const random7DigitNumber=()=> {
  
  let randomNumber = Math.floor(Math.random() * 100000000);
  
  let randomString = randomNumber.toString();
  
  while (randomString.length < 7) {
    randomString = '0' + randomString;
  }
  return randomString;
}

const itemRandomNumber=()=>{
  return Math.floor(Math.random() * (700 - 100 + 1)) + 100;
}


module.exports = {
  createProject,
  getProjectById,
  deleteProjectById,
  getAllProjectsList,
  updateProjectbyId
};