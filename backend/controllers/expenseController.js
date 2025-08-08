const xlsx = require("xlsx");
const Expense = require("../models/Expense");

// Add Expense
exports.addExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const { icon, category, amount, date } = req.body;

    // Check for missing fields
    if (!category || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newExpense = new Expense({
      userId,
      icon,
      category,
      amount,
      date: new Date(date),
    });

    await newExpense.save();
    res.status(200).json(newExpense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding new expense", error: error.message });
  }
};

// Delete Expense
exports.deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};

// Get Expense
exports.getExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    // Sort them by the date field (most recent expense first)
    const expense = await Expense.find({ userId }).sort({ date: -1 });
    res.json(expense);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting expense", error: error.message });
  }
};

// Download Expense (in Excel format)
exports.downloadExpense = async (req, res) => {
  const userId = req.user.id;

  try {
    const expense = await Expense.find({ userId }).sort({ date: -1 });

    // Prepare data for excel (maps data into an array of objects)
    const data = expense.map((item) => ({
      Category: item.category,
      Amount: item.amount,
      Date: item.date,
    }));

    // Create a new excel workbook
    const wb = xlsx.utils.book_new();
    // Convert the data to a sheet
    const ws = xlsx.utils.json_to_sheet(data);
    // Add the sheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, "Expense");
    // Save the file
    xlsx.writeFile(wb, "expense_details.xlsx");

    // Download the file
    res.download("expense_details.xlsx");
  } catch (error) {
    res.status(500).json({
      message: "Error downloading expense in excel",
      error: error.message,
    });
  }
};
