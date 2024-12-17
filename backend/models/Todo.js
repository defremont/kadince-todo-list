const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
    {
        task: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
