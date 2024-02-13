const User = require("../models/User"); 

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

module.exports = {
  createUser,
};