import React from "react";
import axios from "axios";

const TodoList = ({ todos, fetchTodos }) => {
    const deleteTodo = async (id) => {
        await axios.delete(`http://localhost:5000/api/todos/${id}`);
        fetchTodos();
    };

    const toggleComplete = async (todo) => {
        await axios.put(`http://localhost:5000/api/todos/${todo._id}`, {
            isCompleted: !todo.isCompleted,
        });
        fetchTodos();
    };

    return (
        <ul>
            {todos.map((todo) => (
                <li key={todo._id}>
                    <span
                        style={{
                            textDecoration: todo.isCompleted
                                ? "line-through"
                                : "none",
                        }}
                    >
                        {todo.task}
                    </span>
                    <button onClick={() => toggleComplete(todo)}>
                        {todo.isCompleted ? "Undo" : "Complete"}
                    </button>
                    <button onClick={() => deleteTodo(todo._id)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
};

export default TodoList;
