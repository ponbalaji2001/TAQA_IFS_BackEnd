const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");

router.post("/invoice/create", invoiceController.createInvoice);
router.post("/invoice/getall", invoiceController.getAllInvoices);

module.exports = router;