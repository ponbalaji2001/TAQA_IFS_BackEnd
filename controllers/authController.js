const User = require("../models/User");

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      res.status(200).json({
        message: "Login successful",
        user: user,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  };

  module.exports = {
    login
  };
  
  