const express = require("express");
const Todo = require("../models/Todo");
const router = express.Router();

// Get all todos
router.get("/", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;
        const sortBy = req.query.sortBy || "createdAt";
        const filter = req.query.filter || "all";
        const searchString = req.query.searchString || "";

        // Build the filter condition
        const todoQueryFilter = filter === "all"
            ? {}
            : { isCompleted: filter === "complete" };

        // Build the aggregation pipeline
        const aggregationPipeline = [
            // Match stage for filtering
            { $match: {...todoQueryFilter, task: { $regex: searchString, $options: 'i' }} },
        ];

        // Add sorting logic based on sortBy parameter
        if (sortBy === "dueDate") {
            // Custom sorting for dueDate
            aggregationPipeline.push(
                {
                    $addFields: {
                        // Calculate time difference from now for non-null dates
                        timeDifference: {
                            $cond: {
                                if: { $ne: ["$dueDate", null] },
                                then: {
                                    $abs: {
                                        $subtract: ["$dueDate", new Date()]
                                    }
                                },
                                else: Number.MAX_SAFE_INTEGER // Large number for null dates
                            }
                        },
                        // Boolean field for null check
                        hasNoDueDate: {
                            $cond: {
                                if: { $eq: ["$dueDate", null] },
                                then: 1,
                                else: 0
                            }
                        }
                    }
                },
                {
                    $sort: {
                        hasNoDueDate: 1,        // Sort null dates last
                        timeDifference: -1       // Sort by closest date first
                    }
                }
            );
        } else if (sortBy === "priority") {
            aggregationPipeline.push({ $sort: { priority: 1 } });
        } else {
            // Default sorting for other fields (like createdAt)
            aggregationPipeline.push({ $sort: { [sortBy]: -1 } });
        }

        // Add pagination
        aggregationPipeline.push(
            { $skip: skip },
            { $limit: limit }
        );

        // Execute the aggregation
        const todos = await Todo.aggregate(aggregationPipeline);

        // Get total count for pagination
        const countPipeline = [
            { $match: {...todoQueryFilter, task: { $regex: searchString, $options: 'i' }} },
            { $count: 'total' }
        ];
        const countResult = await Todo.aggregate(countPipeline);
        const total = countResult.length > 0 ? countResult[0].total : 0;

        res.json({
            todos,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    } catch (error) {
        console.error('Error in fetching todos:', error);
        res.status(500).json({ message: "Failed to fetch todos" });
    }
}); 

// Create a new todo
router.post("/", async (req, res) => {
    const todo = await Todo.create({
        task: req.body.task,
        dueDate: req.body.dueDate,
        completedAt: req.body.completedAt,
        priority: req.body.priority,
        description: req.body.description,
    });
    res.json(todo);
});

// Update a todo
router.put("/:id", async (req, res) => {
    const todo = await Todo.findByIdAndUpdate(
        req.params.id,
        { dueDate: req.body.dueDate, completedAt: req.body.completedAt, task: req.body.task, isCompleted: req.body.isCompleted, description: req.body.description, priority: req.body.priority },
    );
    res.json(todo);
});

// Delete a todo
router.delete("/:id", async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Todo Deleted" });
});
module.exports = router;
