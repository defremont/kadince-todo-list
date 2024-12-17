const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();

// Get all todos
router.get("/", async (req, res) => {
    const todos = await Todo.find();
    res.json(todos);
});

// Create a new todo
router.post("/", async (req, res) => {
    const todo = await Todo.create({ task: req.body.task });
    res.json(todo);
});

// Update a todo
router.put("/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    res.json(todo);
});

// Delete a todo
router.delete("/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted" });
});

module.exports = router;
