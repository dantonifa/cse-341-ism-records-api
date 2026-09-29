// Import your Mongoose model using your exact file naming and directory structure
const Record = require("../models/record");

// GET /records - Retrieve all student records from the database
const getAllRecords = async (req, res) => {
  try {
    const records = await Record.find();
    res.status(200).json(records);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving records", error: err.message });
  }
};

// GET /records/:id - Find a specific student record using their unique business 'studentId'
const getRecordById = async (req, res) => {
  try {
    const student = await Record.findOne({ studentId: req.params.id });
    if (!student)
      return res.status(404).json({ message: "Student record not found" });
    res.status(200).json(student);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error finding record", error: err.message });
  }
};

// POST /records - Create and store a brand new student profile
const createRecord = async (req, res) => {
  try {
    const newRecord = new Record(req.body);
    await newRecord.save();
    res
      .status(201)
      .json({ message: "Record created successfully", data: newRecord });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error creating record", error: err.message });
  }
};

// PUT /records/:id - Modify grades or metadata using the target studentId
const updateRecord = async (req, res) => {
  try {
    const updatedStudent = await Record.findOneAndUpdate(
      { studentId: req.params.id },
      req.body,
      { new: true, runValidators: true }, // Returns the newly modified document and applies Schema validation rules
    );
    if (!updatedStudent)
      return res.status(404).json({ message: "Student record not found" });
    res
      .status(200)
      .json({ message: "Record updated successfully", data: updatedStudent });
  } catch (err) {
    res
      .status(400)
      .json({ message: "Error updating record", error: err.message });
  }
};

// DELETE /records/:id - Completely remove an academic file using their studentId
const deleteRecord = async (req, res) => {
  try {
    const deletedStudent = await Record.findOneAndDelete({
      studentId: req.params.id,
    });
    if (!deletedStudent)
      return res.status(404).json({ message: "Student record not found" });
    res
      .status(200)
      .json({ message: "Record deleted successfully from the database" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error deleting record", error: err.message });
  }
};

module.exports = {
  getAllRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
};
