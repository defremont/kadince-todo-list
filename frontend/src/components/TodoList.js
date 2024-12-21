import React, { useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Checkbox,
    TextField,
    Dialog,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    FormControlLabel,
    Chip,
    Typography,
    Backdrop,
    CircularProgress,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";

const TodoList = ({ todos, fetchTodos, setLoading, loading }) => {
    const [editingId, setEditingId] = useState(null);
    const [editTodo, setEditTodo] = useState({
        task: "",
        priority: 0,
        dueDate: null,
        isCompleted: false,
    });
    const [editDialog, setEditDialog] = useState(false);
    const priorityLabels = ["Low", "Medium", "High"];
    const priorityColors = ["success", "warning", "error"]; // MUI color variants for priority

    const deleteTodo = async (id) => {
        setLoading(true);
        await axios.delete(process.env.REACT_APP_API_URL + `/api/todos/${id}`);
        fetchTodos();
        setLoading(false);
    };

    const toggleComplete = async (todo) => {
        setLoading(true);
        await axios.put(process.env.REACT_APP_API_URL + `/api/todos/${todo._id}`, {
            isCompleted: !todo.isCompleted,
        });
        fetchTodos();
        setLoading(false);
    };

    const startEditing = (todo) => {
        setEditDialog(true);
        setEditTodo({ ...todo, dueDate: todo.dueDate ? new Date(todo.dueDate) : null });
        setEditingId(todo._id);
    };

    const saveEdit = async (id) => {
        setLoading(true);
        const updatedTodo = {
            ...editTodo,
            dueDate: editTodo.dueDate ? editTodo.dueDate.toISOString() : null,
        };
        await axios.put(process.env.REACT_APP_API_URL + `/api/todos/${id}`, updatedTodo);
        setEditingId(null);
        setEditDialog(false);
        setEditTodo({
            task: "",
            priority: "",
            dueDate: null,
            isCompleted: false,
        });
        fetchTodos();
        setLoading(false);
    };

    const closeEditDialog = () => {
        setEditDialog(false);
        setEditTodo({
            task: "",
            priority: "",
            dueDate: null,
            isCompleted: false,
        });
        setEditingId(null);
    };

    return (
        <>
            <Backdrop
                open={loading}
                style={{ zIndex: 1201, color: "#fff" }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <List>
                {todos.map((todo) => (
                    <ListItem key={todo._id} divider>
                        <Checkbox
                            edge="start"
                            checked={todo.isCompleted}
                            onChange={() => toggleComplete(todo)}
                        />

                        <ListItemText
                            primary={
                                <>
                                    <Typography
                                        variant="caption"
                                        style={{
                                            textDecoration: todo.isCompleted
                                                ? "line-through"
                                                : "none",
                                        }}
                                    >
                                        <Chip
                                            label={priorityLabels[todo.priority]}
                                            color={priorityColors[todo.priority]}
                                            size="small"
                                            style={{
                                                marginRight: "8px",
                                                height: "14px",
                                            }}
                                        />
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        marginTop={1}
                                        style={{
                                            textDecoration: todo.isCompleted
                                                ? "line-through"
                                                : "none",
                                        }}
                                    >
                                        {todo.task}
                                    </Typography>
                                </>
                            }
                            secondary={
                                <Typography
                                    variant="overline"
                                    style={{
                                        color:
                                            todo.dueDate &&
                                                new Date(todo.dueDate) < new Date() &&
                                                !todo.isCompleted
                                                ? "red"
                                                : "inherit",
                                    }}
                                >
                                    {todo.dueDate
                                        ? new Date(todo.dueDate).toLocaleDateString()
                                        : ""}
                                </Typography>
                            }
                        />
                        <ListItemSecondaryAction>
                            <IconButton
                                disabled={loading}
                                onClick={() => startEditing(todo)}
                            >
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => deleteTodo(todo._id)}>
                                <DeleteIcon color="error" />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
            <Dialog open={editDialog} onClose={closeEditDialog} fullWidth>
                <Box padding={2} display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Task Name"
                        variant="outlined"
                        fullWidth
                        value={editTodo.task}
                        onChange={(e) => setEditTodo({ ...editTodo, task: e.target.value })}
                        required
                    />
                    <FormControl fullWidth>
                        <InputLabel id="priority-label">Priority</InputLabel>
                        <Select
                            label="Priority"
                            labelId="priority-label"
                            value={editTodo.priority}
                            onChange={(e) =>
                                setEditTodo({ ...editTodo, priority: e.target.value })
                            }
                        >
                            <MenuItem value={2}>Low</MenuItem>
                            <MenuItem value={1}>Medium</MenuItem>
                            <MenuItem value={0}>High</MenuItem>
                        </Select>
                    </FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                            label="Due Date"
                            value={editTodo.dueDate}
                            onChange={(newValue) =>
                                setEditTodo({ ...editTodo, dueDate: newValue })
                            }
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                    <FormControl>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={editTodo.isCompleted}
                                    onChange={(e) =>
                                        setEditTodo({
                                            ...editTodo,
                                            isCompleted: e.target.checked,
                                        })
                                    }
                                />
                            }
                            label="Done"
                        />
                    </FormControl>
                    <Box display="flex" justifyContent="flex-end" gap={2}>
                        <Button onClick={closeEditDialog} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => saveEdit(editingId)}
                            variant="contained"
                            color="primary"
                            disabled={!editTodo.task.trim()}
                        >
                            Save
                        </Button>
                    </Box>
                </Box>
            </Dialog>
        </>
    );
};

export default TodoList;
