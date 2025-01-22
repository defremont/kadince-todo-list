import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Box,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Checkbox,
    FormGroup,
    FormControlLabel,
    IconButton,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DeleteIcon from "@mui/icons-material/Delete";
import todoService from "../services/todoService";

const TodoForm = ({ fetchTodos, initialValues, onClose }) => {
    const [task, setTask] = useState(initialValues?.task || "");
    const [dueDate, setDueDate] = useState(initialValues?.dueDate || null);
    const [priority, setPriority] = useState(initialValues?.priority || 1);
    const [isCompleted, setIsCompleted] = useState(initialValues?.isCompleted || false);
    const [completedAt, setCompletedAt] = useState(initialValues?.dueDate || null);

    useEffect(() => {
        if (initialValues) {
            setTask(initialValues.task || "");
            setDueDate(initialValues.dueDate ? new Date(initialValues.dueDate) : null);
            setCompletedAt(initialValues.completedAt ? new Date(initialValues.completedAt) : null);
            setPriority(initialValues.priority);
            setIsCompleted(initialValues.isCompleted || false);
        }
    }, [initialValues]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        onClose();
        try {
            if (initialValues && initialValues._id) {
                // Update existing task                
                await todoService.updateTodo(initialValues._id, {
                    task,
                    dueDate,
                    completedAt,
                    priority,
                    isCompleted
                });
            } else {
                // Create a new task
                await todoService.createTodo({
                    task,
                    dueDate,
                    completedAt,
                    priority,
                    isCompleted
                });
            }
            fetchTodos();
        } catch (error) {
            console.error("Error saving task:", error);
        }
    };

    const deleteTodo = async (id) => {
        onClose();
        await todoService.deleteTodo(id);
        fetchTodos();
    };
    const handlePriorityChange = (event) => setPriority(event.target.value);

    return (
        <Box component="form" onSubmit={handleSubmit} display="flex" gap={2} flexDirection="column">
            <TextField
                label="Task Name"
                variant="outlined"
                fullWidth
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
            />
            <Box display="flex" gap={1}>
                <FormControl fullWidth>
                    <InputLabel id="priority">Priority</InputLabel>
                    <Select
                        labelId="priority"
                        id="priority-select"
                        label="Priority"
                        value={priority}
                        onChange={handlePriorityChange}
                    >
                        <MenuItem value={2}>Low</MenuItem>
                        <MenuItem value={1}>Medium</MenuItem>
                        <MenuItem value={0}>High</MenuItem>
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>                
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Completed At"
                        value={completedAt}
                        onChange={(newValue) => setCompletedAt(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>
            <Box display="flex"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                }} gap={5}>
                <FormGroup>
                    <FormControlLabel control={<Checkbox
                        checked={isCompleted}
                        onChange={() => setIsCompleted(!isCompleted)}
                    />} label="Done" />
                </FormGroup>
                
            { initialValues ?
                <IconButton onClick={() => deleteTodo(initialValues._id)}>
                    <DeleteIcon color="error" />
                </IconButton> : ""
            }
            </Box>
            <Button variant="contained" color="primary" type="submit">
                {initialValues ? "Update" : "Save"}
            </Button>
            
        </Box>
    );
};

export default TodoForm;
