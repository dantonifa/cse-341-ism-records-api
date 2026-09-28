const express = require("express");
const router = express.Router();
const recordsController = require("../controllers/recordsController");

// CRUD Endpoints
router.get("/", recordsController.getAllRecords); // GET /records
router.get("/:id", recordsController.getRecordById); // GET /records/:id
router.post("/", recordsController.createRecord); // POST /records
router.put("/:id", recordsController.updateRecord); // PUT /records/:id
router.delete("/:id", recordsController.deleteRecord); // DELETE /records/:id

module.exports = router;
