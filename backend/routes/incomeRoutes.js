const express = require("express");
const {
  addIncome,
  deleteIncome,
  getIncome,
  downloadIncome,
} = require("../controllers/incomeController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// POST /income - Add a new income entry
router.post("/income", protect, addIncome);

// DELETE /income/:id - Delete an income entry by ID
router.delete("/income/:id", protect, deleteIncome);

// GET /income - Retrieve all income entries
router.get("/income", protect, getIncome);

// GET /income/download - Download income data as a file
router.get("/income/download", protect, downloadIncome);

module.exports = router;
