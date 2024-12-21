import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const TodoForm = ({ fetchTodos, loading, setLoading }) => {
    const [task, setTask] = useState("");
    const [dueDate, setDueDate] = useState(null);
    const [priority, setPriority] = useState(1);

    const addTodo = async (e) => {
        e.preventDefault();
        await axios.post(process.env.REACT_APP_API_URL + "/api/todos", { task, dueDate, priority });
        fetchTodos();
        setTask("");
        setDueDate(null);
    };

    const handlePriorityChange = (event) => {
        console.log(event);
        setPriority(event.target.value);
    };
    return (
        <Box component="form" onSubmit={addTodo} display="flex" gap={2} flexDirection="column">
            <TextField
                label="Task Name"
                variant="outlined"
                fullWidth
                value={task}
                onChange={(e) => setTask(e.target.value)}
                required
            />
            <Box display="flex" gap={1}><FormControl fullWidth>
                <InputLabel id="priority">Priority</InputLabel>
                <Select
                    labelId="priority"
                    id="demo-simple-select" label="Priority" value={priority} onChange={handlePriorityChange}>
                    <MenuItem value={2}>Low</MenuItem>
                    <MenuItem value={1}>Medium</MenuItem >
                    <MenuItem value={0}>High</MenuItem >
                </Select>
            </FormControl>
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
                Save
            </Button>
        </Box>
    );
};

export default TodoForm;
