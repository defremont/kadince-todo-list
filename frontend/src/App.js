import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  AppBar,
  Toolbar,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchTodos = async () => {
    const { data } = await axios.get("http://localhost:5000/api/todos");
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter) setFilter(newFilter);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Kadince TODO</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Todo List
          </Typography>

          {/* Filter */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            fullWidth
            style={{ marginBottom: "10px" }} // Add this line
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="pending">Pending</ToggleButton>
            <ToggleButton value="complete">Complete</ToggleButton>
          </ToggleButtonGroup>

          {/* Add and List Todos */}
          <TodoForm fetchTodos={fetchTodos} />
          <TodoList todos={todos} fetchTodos={fetchTodos} filter={filter} />
        </Box>
      </Container>
    </>
  );
};

export default App;
