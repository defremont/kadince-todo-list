const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();

// Get all todos
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Default to page 1
        const limit = parseInt(req.query.limit) || 5; // Default to 5 items per page
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "createdAt"; // Default sorting field
        const todoQueryFilter = req.query.filter === "all" ? {} : { isCompleted: req.query.filter === "complete" } || { isCompleted: req.query.filter === "pending" };
        const todos = await Todo.find(todoQueryFilter).sort({ [sortBy]: sortBy === "priority" ? 1 : -1 }).skip(skip).limit(limit);
        const count = await Todo.find(todoQueryFilter)
        const total = await count.length;

        res.json({
            todos,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch todos" });
    }
});


// Create a new todo
router.post("/", async (req, res) => {
    const todo = await Todo.create({
        task: req.body.task,
        dueDate: req.body.dueDate,
        priority: req.body.priority,
        description: req.body.description,
    });
    res.json(todo);
});

// Update a todo
router.put("/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { dueDate: req.body.dueDate, task: req.body.task, isCompleted: req.body.isCompleted, description: req.body.description, priority: req.body.priority },
    );
    res.json(todo);
});

// Delete a todo
router.delete("/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted" });
});
module.exports = router;
