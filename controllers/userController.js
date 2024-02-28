const User = require("../models/User"); 
const Project = require("../models/Project");

const createUser = async (req, res) => {
  try {
    const data= req.body;
    const user = await User.create({
      name:data.name,
      password:data.password,
      role:data.role,
   });
   
    res.status(200).json({ message: "User created successfully", user });
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



module.exports = {
  createUser,
  getAllSupervisor,
  getAllAdmin,
  getAllUser,
  getSupervisorById,
  getSupervisorTimesheetSheet
};