import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const TodoForm = ({ fetchTodos }) => {
    const [task, setTask] = useState("");
    const [dueDate, setDueDate] = useState(null); // Add this line

    const addTodo = async (e) => {
        e.preventDefault();
        // Call backend to create a new task (ensure `dueDate` is sent correctly)
        await axios.post(process.env.REACT_APP_API_URL + "/api/todos", { task, dueDate });
        fetchTodos();
        setTask("");
        setDueDate(null);
    };

    return (
        <Box component="form" onSubmit={addTodo} display="flex" gap={2} flexDirection="column">
            <Box display="flex" gap={2}>
                <TextField
                    label="New Task"
                    variant="outlined"
                    fullWidth
                    value={task}
                    onChange={(e) => setTask(e.target.value)}
                    required
                />
                <LocalizationProvider dateAdapter={AdapterDateFns} >
                    <DatePicker
                        label="Due Date"
                        value={dueDate}
                        onChange={(newValue) => setDueDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </Box>
            <Button variant="contained" color="primary" type="submit">
                Add
            </Button>
        </Box>
    );
};

export default TodoForm;
