const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
    {
        task: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
        dueDate: { type: Date },
        priority: { type: Number, enum: [0, 1, 2], default: 2 },
        description: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
