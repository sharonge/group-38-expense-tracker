const Expense = require("../models/Expense");

const getAllExpenses = async (req, res, next) => {
  // Retrieve userId from res.locals
  const userId = res.locals.userId;

  try {
    const expenses = await Expense.find({ userId });
    res.json({ expenses });
  } catch (error) {
    next(error);
  }
};

const addExpense = async (req, res, next) => {
  const { category, description, amount, date } = req.body;

  try {
    const newExpense = new Expense({
      category,
      description,
      amount,
      date,
    });

    await newExpense.save();

    res.status(201).json({ message: "Expense added successfully" });
  } catch (error) {
    next(error);
  }
};

const getExpenseById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const userId = req.userId;
    const expense = await Expense.findOne({ _id: id, userId });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ expense });
  } catch (error) {
    next(error);
  }
};

const updateExpense = async (req, res, next) => {
  const { id } = req.params;
  const { category, description, amount, date } = req.body;

  try {
    const userId = req.userId;

    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, userId },
      { category, description, amount, date },
      { new: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense updated successfully" });
  } catch (error) {
    next(error);
  }
};

const deleteExpense = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedExpense = await Expense.findOneAndDelete({ _id: id, userId });

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.json({ message: "Expense deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllExpenses,
  addExpense,
  getExpenseById,
  updateExpense,
  deleteExpense,
};
