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
router.post("/add", protect, addIncome);

// DELETE /income/:id - Delete an income entry by ID
router.delete("/:id", protect, deleteIncome);

// GET /income - Retrieve all income entries
router.get("/get", protect, getIncome);

// GET /income/download - Download income data as a file
router.get("/download", protect, downloadIncome);

module.exports = router;
