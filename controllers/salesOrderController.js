const SalesOrder = require("../models/SalesOrder"); 

const createSaleOrder = async (productDetails) => {
  try {
    const data =productDetails;
    const salesorder =await SalesOrder.create({
      name:data.name,
      order_number:data.order_number,
      order_id:data.order_id,
      items:data.items,
      status:data.status,
    });
    return true;
    // res.status(200).json({ message: "Project created successfully", salesorder});
  } catch (error) {
    console.log(error);
    return false;
    // res.status(500).json({ message: "Internal server error" });
  }
};

function random8DigitNumber() {
  
  let randomNumber = Math.floor(Math.random() * 100000000);
  
  let randomString = randomNumber.toString();
  
  while (randomString.length < 8) {
    randomString = '0' + randomString;
  }
  return randomString;
}

function random7DigitNumber() {
  
  let randomNumber = Math.floor(Math.random() * 100000000);
  
  let randomString = randomNumber.toString();
  
  while (randomString.length < 7) {
    randomString = '0' + randomString;
  }
  return randomString;
}

function itemRandomNumber(){
  return Math.floor(Math.random() * (700 - 100 + 1)) + 100;
}

module.exports = {
  createSaleOrder,
  random8DigitNumber,
  random7DigitNumber,
  itemRandomNumber
}
