const Income = require("../models/Income");
const Expense = require("../models/Expense");
const { isValidObjectId, Types } = require("mongoose");

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id;
    const userObjectId = Types.ObjectId(String(userId));

    // Fetch total Income
    const totalIncome = await Income.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("totalIncome", {
      totalIncome,
      userId: isValidObjectId(userId),
    });

    // Fetch total Expense
    const totalExpense = await Expense.aggregate([
      { $match: { userId: userObjectId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    console.log("totalExpense", {
      totalExpense,
      userId: isValidObjectId(userId),
    });

    // Get Income transactions of last 60 days
    const lastIncomeTransactions = await Income.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total Income of last 60 days
    const lastTotalIncome = lastIncomeTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get Expense transactions of last 60 days
    const lastExpenseTransactions = await Expense.find({
      userId,
      date: { $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000) },
    }).sort({ date: -1 });

    // Get total Expense of last 60 days
    const lastTotalExpense = last60DaysExpenseTransactions.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Fetch last 5 transactions (income + expense)
    const lastTransactions = [
      ...(await Income.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "Income",
        })
      ),
      ...(await Expense.find({ userId }).sort({ date: -1 }).limit(5)).map(
        (txn) => ({
          ...txn.toObject(),
          type: "Expense",
        })
      ),
    ].sort((a, b) => b.date - a.date); // Sort by latest order

    // Final Response
    res.json({
      totalBalance:
        (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
      totalIncome: totalIncome[0]?.total || 0,
      lastExpense: {
        total: lastTotalExpense,
        transactions: lastExpenseTransactions,
      },
      lastIncome: {
        total: lastTotalIncome,
        transactions: lastIncomeTransactions,
      },
      recentTransactions: lastTransactions,
    });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error generating final response",
        error: error.message,
      });
  }
};
