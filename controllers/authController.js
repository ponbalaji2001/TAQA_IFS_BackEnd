const User = require("../models/User");

const login = async (req, res) => {
  console.log( req.body);
    const { id, password } = req.body;
    try {
      const user = await User.findOne({ id:id });
      if (!user) {
        return res.status(401).json({ message: "Invalid user" });
      }
      console.log(user);
      if(password === user.password){
        user["password"] = "";
        res.status(200).json({
          message: "Authenticated successfully",
          user: user,
        });
      }
      else{
        return res.status(401).json({ message: "Invalid Credential" });
      }
      
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = {
    login
  };
  
  