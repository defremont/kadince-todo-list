import React, { useState } from "react";
import {
    List,
    ListItem,
    ListItemText,
    IconButton,
    Dialog,
    Chip,
    Box,
    Typography,
    Backdrop,
    CircularProgress,
    DialogTitle,
    DialogContent,
    Checkbox,
} from "@mui/material";
import TodoForm from "./TodoForm";
import CloseIcon from '@mui/icons-material/Close';
import todoService from "../services/todoService";

const TodoList = ({ todos, fetchTodos, setLoading, loading }) => {
    const [editTodo, setEditTodo] = useState({
        task: "",
        priority: 0,
        dueDate: null,
        isCompleted: false,
    });
    const [editDialog, setEditDialog] = useState(false);
    const priorityLabels = ["High", "Medium", "Low",]; // Priority labels
    const priorityColors = ["error", "warning", "success"]; // MUI color variants for priority

    const toggleComplete = async (todo) => {
        setLoading(true);
        await todoService.updateTodo(todo._id, {
            isCompleted: !todo.isCompleted,
        });
        fetchTodos();
        setLoading(false);
    };

    const startEditing = (todo) => {
        setEditDialog(true);
        setEditTodo({ ...todo, dueDate: todo.dueDate ? new Date(todo.dueDate) : null });
    };


    const closeEditDialog = () => {
        setEditDialog(false);
        setEditTodo({
            task: "",
            priority: "",
            dueDate: null,
            isCompleted: false,
        });
    };

    return (
        <>
            <Backdrop
                open={loading}
                style={{ zIndex: 1000, color: "#fff" }}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <List>
                {todos.map((todo) => (
                    <Box display="flex" gap={1}>
                        <Checkbox
                            edge="start"
                            checked={todo.isCompleted}
                            onChange={() => toggleComplete(todo)}
                        />
                        <ListItem id="listItem" key={todo._id} divider
                            style={{
                                backgroundColor: todo.isCompleted
                                    ? "#555"
                                    : "",
                                color: todo.isCompleted
                                    ? "#fff"
                                    : "",
                            }}
                            onClick={() => startEditing(todo)}>
                            <ListItemText
                                primary={
                                    <div
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}>
                                        <Typography
                                            variant="body1"
                                            style={{
                                                marginBottom: "15px",
                                            }}
                                        >
                                            {todo.task}
                                        </Typography>
                                    </div>
                                }
                                secondary={
                                    <Typography
                                        variant="caption"
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <div
                                            style={{
                                                color:
                                                    todo.dueDate &&
                                                        new Date(todo.dueDate) < new Date() &&
                                                        !todo.isCompleted
                                                        ? "red"
                                                        : "inherit",
                                            }}
                                        >
                                            {todo.isCompleted
                                                ? <Chip
                                                    label="Done"
                                                    style={{ backgroundColor: '#00AA9e', marginRight: "10px" }}
                                                    size="small"
                                                />
                                                : ""}{todo.dueDate
                                                    ? new Date(todo.dueDate).toLocaleDateString()
                                                    : ""}
                                        </div>
                                        <Chip
                                            label={priorityLabels[todo.priority]}
                                            color={priorityColors[todo.priority]}
                                            size="small"
                                        />
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </Box>
                ))}
            </List>
            <Dialog open={editDialog} onClose={closeEditDialog} fullWidth>
                <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                    Edit Task
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={closeEditDialog}
                    sx={(theme) => ({
                        position: "absolute",
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <CloseIcon />
                </IconButton>
                <DialogContent dividers>
                    <TodoForm
                        fetchTodos={fetchTodos}
                        loading={loading}
                        setLoading={setLoading}
                        initialValues={editTodo}
                        onClose={closeEditDialog}
                    />
                </DialogContent>
            </Dialog>
        </>
    );
};

export default TodoList;
