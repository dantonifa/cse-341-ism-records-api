const mongoose = require("mongoose");
const Record = require("../models/record");
let records = require("./student-records.json");

require("dotenv").config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    // If JSON is a single object, wrap it in an array
    if (!Array.isArray(records)) {
      records = [records];
    }

    await Record.insertMany(records);
    console.log(`✅ Inserted ${records.length} student record(s)`);

    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error inserting student record(s):", error);
    process.exit(1);
  }
};

seedDB();
