const User = require("../models/User"); 
const Project = require("../models/Project");
const TimeSheet = require("../models/timesheet");
const mongoose = require('mongoose');

const createUser = async (req, res) => {
  try {
    const data= req.body;
    const user = await User.create({
      name:data.name,
      password:data.password,
      role:data.role,
      id:random5DigitNumber()
   }).then((result)=>{
      console.log(result);
      if(result && (data.role==="supervisor" || data.role==="manager")){
      let sendData = {
        _id: result._id,
        empid: result.id,
        empname:result.name,
        supid: "65cb4ada4aed17b2c3ce2cdc",
        projectid: "",
        pro_start_date: "",
        pro_end_date: "",
      }
      // console.log("send data",sendData);
      const newTS = createTimeSheet(sendData);
      res.status(200).json({ 
        message: "User created successfully",
        tsmsg:"Timesheet created Successfully",
        result
       });
      }else{
        res.status(200).json({ 
          message: "User created successfully",
          tsmsg:"Timesheet Not created",
          result
         });
      }
      
   }).catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error",error:err });
    });    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllSupervisor = async (req, res) => {
  try {
    const allEmp = await User.find({role:"supervisor"});
    res.status(200).json(allEmp);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllAdmin = async (req, res) => {
  try {
    const allEmp = await User.find({role:"admin"});
    res.status(200).json(allEmp);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllUser = async (req, res) => {
  try {
    const allEmp = await User.find({role:"user"});
    res.status(200).json(allEmp);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllManager = async (req, res) => {
  try {
    const allEmp = await User.find({role:"manager"});
    res.status(200).json(allEmp);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSupervisorById = async (req, res) => {
  try {
    const sup = await User.findById(req.params.id);
    res.status(200).json(sup);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSupervisorTimesheetSheet = async (req, res) => {
  try {
      const data = req.body;
      const project = await Project.findOne({ "pid": data.pid });
      const project_phases = project.phases;

      if (!project) {
          return res.status(404).json({ message: "Project not found" });
      }

      for (let phase of project_phases) {
          for (let task of phase.tasks) {
              for (let taskType of Object.keys(task)) {
                  const taskArray = task[taskType] || [];

                  if (taskArray.length > 0) {
                      const filteredTasks = taskArray.filter(item => {
                          return item.supervisor && item.supervisor.supervisor_id === data.supervisor_id;
                      });

                      if (filteredTasks.length > 0) {
                          task[taskType] = filteredTasks;
                      } else {
                          delete task[taskType];
                      }
                  } else {
                      delete task[taskType];
                  }
              }
          }
      }
      
      const filteredPhases = project_phases.filter(phase => {
        return phase.tasks.some(task => {
            return Object.values(task).some(taskArray => {
                return Array.isArray(taskArray) && taskArray.length > 0;
            });
        });
    });
    
    res.status(200).json(filteredPhases);
    
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
  }
};

const createTimeSheet = async (details) => {

  try {
    let data = details;
    const newts = await TimeSheet.create({
      employee_id: data._id,
      empid: data.empid,
      current_supervisor_id: data.supid,
      current_project_id:  null,
      current_phase_start_date: data.pro_start_date,
      current_phase_end_date: data.pro_end_date,
      timesheets: [],
      tsStatus: "active"
    });
    console.log("Timesheet created : ", newts);
    return true;
  } catch (err) {
    console.log("While ts creating ", err);
    return false;
  }
}

const random5DigitNumber = () => {

  let randomNumber = Math.floor(Math.random() * 100000);

  let randomString = randomNumber.toString();

  while (randomString.length < 5) {
    randomString = '0' + randomString;
  }
  return randomString;
}



module.exports = {
  createUser,
  getAllSupervisor,
  getAllAdmin,
  getAllUser,
  getAllManager,
  getSupervisorById,
  getSupervisorTimesheetSheet
};