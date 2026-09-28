const Record = require("../models/record");

// Get all records (filter dynamically by query params)
exports.getAllRecords = async (req, res) => {
  try {
    const query = {};

    // Loop through possible filter keys
    const filterKeys = ["year", "course", "grado", "seccion"];
    filterKeys.forEach((key) => {
      if (req.query[key]) {
        query[key] = req.query[key];
      }
    });

    const records = await Record.find(query);
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Error fetching records", error });
    console.error("Error fetching records:", error);
  }
};

//Get one record by ID
exports.getRecordById = async (req, res) => {
  try {
    const record = await Record.findById(req.params.id);
    if (!record) return res.status(404).json({ message: "Record not found" });
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching record", error: error });
    console.error("Error fetching record:", error);
  }
};

// Create a new record
exports.createRecord = async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(400).json({ message: "Error creating record", error: error });
    console.error("Error creating record:", error);
  }
};

// Update a record by ID
exports.updateRecord = async (req, res) => {
  try {
    const updatedRecord = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!updatedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: "Error updating record", error: error });
    console.error("Error updating record:", error);
  }
};

// Delete a record by ID
exports.deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await Record.findByIdAndDelete(req.params.id);
    if (!deletedRecord)
      return res.status(404).json({ message: "Record not found" });
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error: error });
    console.error("Error deleting record:", error);
  }
};
