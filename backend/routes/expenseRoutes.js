const express = require("express");
const {
  addExpense,
  deleteExpense,
  getExpense,
  downloadExpense,
} = require("../controllers/expenseController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /expense - Add a new expense entry
router.post("/add", protect, addExpense);

// DELETE /expense/:id - Delete an expense entry by ID
router.delete("/:id", protect, deleteExpense);

// GET /expense - Retrieve all expense entries
router.get("/get", protect, getExpense);

// GET /expense/download - Download expense data as a file
router.get("/download", protect, downloadExpense);

module.exports = router;
