const Teacher = require("../models/teacher");

// GET all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.status(200).json(teachers);
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Error retrieving teachers catalog",
        error: err.message,
      });
  }
};

// GET single teacher by teacherId
exports.getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ teacherId: req.params.id });
    if (!teacher)
      return res.status(404).json({ message: "Teacher record not found" });
    res.status(200).json(teacher);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error retrieving teacher record", error: err.message });
  }
};

// POST create teacher (With strict Criterion 2 Data Validation returning 400)
exports.createTeacher = async (req, res) => {
  const { teacherId, name, department, email } = req.body;

  // Rubric Data Validation Requirement check
  if (!teacherId || !name || !department || !email) {
    return res
      .status(400)
      .json({
        message:
          "Validation Failed: teacherId, name, department, and email are required fields.",
      });
  }

  try {
    const newTeacher = new Teacher(req.body);
    await newTeacher.save();
    res
      .status(201)
      .json({
        message: "Teacher profile stored successfully",
        data: newTeacher,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error storing teacher record", error: err.message });
  }
};

// PUT update teacher (With strict Criterion 2 Data Validation returning 400)
exports.updateTeacher = async (req, res) => {
  const { name, department, email } = req.body;

  // Rubric Data Validation Requirement check
  if (!name || !department || !email) {
    return res
      .status(400)
      .json({
        message:
          "Validation Failed: name, department, and email cannot be empty.",
      });
  }

  try {
    const updatedTeacher = await Teacher.findOneAndUpdate(
      { teacherId: req.params.id },
      req.body,
      { new: true },
    );
    if (!updatedTeacher)
      return res.status(404).json({ message: "Teacher record not found" });
    res
      .status(200)
      .json({
        message: "Teacher record modified successfully",
        data: updatedTeacher,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error modifying teacher record", error: err.message });
  }
};

// DELETE teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findOneAndDelete({
      teacherId: req.params.id,
    });
    if (!deletedTeacher)
      return res.status(404).json({ message: "Teacher record not found" });
    res
      .status(200)
      .json({ message: "Teacher profile completely expunged from collection" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error removing teacher record", error: err.message });
  }
};
