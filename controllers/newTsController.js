const TimeSheet = require("../models/newTs");

const alive = async (req, res) => {
  console.log("timesheet");
  res.status(500).json("Success");
};

const updateTs = async (req, res) => {
  console.log(req.body);
  let data = req.body;
  let employee_id = req.body.employee_id;
  try {
    const ts = await TimeSheet.findOne({ employee_id });
    if (ts) {
      //update timesheet trigeers
      return res.status(200).json({
        message: "Timesheet saved successfully",
        data: ts,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  updateTs,
  alive,
};
