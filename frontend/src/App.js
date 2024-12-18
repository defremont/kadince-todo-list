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
  Pagination,
  Select,
  MenuItem
} from "@mui/material";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);
  const [limit, setLimit] = useState(5); // Items per page
  const [sortBy, setSortBy] = useState("createdAt");

  useEffect(() => {
    fetchTodos();
  }, [page, limit, sortBy, filter]);

  const fetchTodos = async () => {
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL + `/api/todos?page=${page}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`
    );
    setTodos(data.todos);
    setTotalPages(data.totalPages);
    setTotalTodos(data.total);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };
  
  const handleFilterChange = (event, newFilter) => {
    if (newFilter) setFilter(newFilter);
    setPage(1);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Kadince TODO Task</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            Todo List ({totalTodos})
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
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">Sort by:</Typography>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="createdAt">Creation Date</option>
              <option value="priority">Priority</option>
              <option value="dueDate">Due Date</option>
            </select>
          </Box>
          {/* Add and List Todos */}
          <TodoForm fetchTodos={fetchTodos} />
          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />

          </Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1">Tasks per page:</Typography>
            <Select value={limit} onChange={handleLimitChange}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem >
              <MenuItem value={20}>20</MenuItem >
            </Select>
          </Box>
          <TodoList todos={todos} fetchTodos={fetchTodos} />
        </Box>
      </Container>
    </>
  );
};

export default App;
