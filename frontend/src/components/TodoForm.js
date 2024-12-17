import React, { useState } from "react";
import axios from "axios";

const TodoForm = ({ fetchTodos }) => {
    const [task, setTask] = useState("");

    const addTodo = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:5000/api/todos", { task });
        fetchTodos();
        setTask("");
    };

    return (
        <form onSubmit={addTodo}>
            <input
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Add a new task"
                required
            />
            <button type="submit">Add</button>
        </form>
    );
};

export default TodoForm;
