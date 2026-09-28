const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true },
    name: { type: String, required: true },
    course: { type: String, required: true },
    grades: {
      parcial1: { type: Number, required: true },
      parcial2: { type: Number, required: true },
      parcial3: { type: Number, required: true },
      parcial4: { type: Number, required: true },
    },
    grado: { type: String, required: true },
    seccion: { type: String, required: true },
    year: { type: Number, required: true },
  },
  { versionKey: false },
); // 👈 disables __v

module.exports = mongoose.model("Record", recordSchema);
