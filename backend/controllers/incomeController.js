const xlsx = require("xlsx");
const Income = require("../models/Income");

// Add Income
exports.addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, source, amount, date } = req.body;

    // Check for missing fields
    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();
    res.status(200).json(newIncome);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding new income", error: error.message });
  }
};

// Delete Income
exports.deleteIncome = async (req, res) => {
  try {
    await Income.findByIdAndDelete(req.params.id);
    res.json({ message: "Income deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting income", error: error.message });
  }
};

// Get Income
exports.getIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    // Sort them by the date field (most recent income first)
    const income = await Income.find({ userId }).sort({ date: -1 });
    res.json(income);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting income", error: error.message });
  }
};

// Download Income (in Excel format)
exports.downloadIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const income = await Income.find({ userId }).sort({ date: -1 });

    // Prepare data for excel (maps data into an array of objects)
    const data = income.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: item.date,
    }));

    // Create a new excel workbook
    const wb = xlsx.utils.book_new();
    // Convert the data to a sheet
    const ws = xlsx.utils.json_to_sheet(data);
    // Add the sheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, "Income");
    // Save the file
    xlsx.writeFile(wb, "income_details.xlsx");

    // Download the file
    res.download("income_details.xlsx");
  } catch (error) {
    res.status(500).json({
      message: "Error downloading income in excel",
      error: error.message,
    });
  }
};
