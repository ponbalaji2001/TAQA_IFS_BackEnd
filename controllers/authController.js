const User = require("../models/User");

const login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: "Invalid user" });
      }
      console.log(username)
      console.log(password+"  "+user.password)
      if (password !== user.password) {
        return res.status(401).json({ message: "Invalid password" });
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
  
  