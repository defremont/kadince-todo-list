const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
    {
        task: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        dueDate: { type: Date },
        priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
