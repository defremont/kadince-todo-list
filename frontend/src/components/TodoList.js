import React, { useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import axios from "axios";

const TodoList = ({ todos, fetchTodos, filter }) => {
    const [editingId, setEditingId] = useState(null);
    const [editTask, setEditTask] = useState("");

    const deleteTodo = async (id) => {
        await axios.delete(process.env.REACT_APP_API_URL + `/api/todos/${id}`);
        fetchTodos();
    };

    const toggleComplete = async (todo) => {
        await axios.put(process.env.REACT_APP_API_URL + `/api/todos/${todo._id}`, {
            isCompleted: !todo.isCompleted,
        });
        fetchTodos();
    };

    const startEditing = (todo) => {
        setEditingId(todo._id);
        setEditTask(todo.task);
    };

    const saveEdit = async (id) => {
        await axios.put(process.env.REACT_APP_API_URL + `/api/todos/${id}`, { task: editTask });
        setEditingId(null);
        setEditTask("");
        fetchTodos();
    };

    return (
        <List>
            {todos.map((todo) => (
                <ListItem key={todo._id} divider>
                    <Checkbox
                        edge="start"
                        checked={todo.isCompleted}
                        onChange={() => toggleComplete(todo)}
                    />

                    {/* Edit or Display */}
                    {editingId === todo._id ? (
                        <TextField
                            value={editTask}
                            onChange={(e) => setEditTask(e.target.value)}
                            fullWidth
                        />
                    ) : (
                        <ListItemText
                            primary={todo.task}
                            secondary={todo.dueDate ? `Due: ${new Date(todo.dueDate).toLocaleDateString()}` : ""}
                            style={{
                                textDecoration: todo.isCompleted
                                    ? "line-through"
                                    : "none",
                                color: todo.dueDate ? new Date(todo.dueDate) < new Date() && !todo.isCompleted ? "red" : "inherit" : "inherit"
                            }}
                        />
                    )}
                    <ListItemSecondaryAction>
                        {editingId === todo._id ? (
                            <IconButton onClick={() => saveEdit(todo._id)}>
                                <SaveIcon color="primary" />
                            </IconButton>
                        ) : (
                            <IconButton onClick={() => startEditing(todo)}>
                                <EditIcon />
                            </IconButton>
                        )}
                        <IconButton onClick={() => deleteTodo(todo._id)}>
                            <DeleteIcon color="error" />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            ))}
        </List>
    );
};

export default TodoList;
