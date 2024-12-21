import React, { useState, useEffect, useCallback } from "react";
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
  MenuItem,
  CircularProgress,
  Dialog,
  Button,
  IconButton,
  DialogContent,
  DialogTitle,
  Icon,
} from "@mui/material";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

// Function to format the date
const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const App = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTodos, setTotalTodos] = useState(0);
  const [limit, setLimit] = useState(5);
  const [sortBy, setSortBy] = useState("createdAt");
  const [loading, setLoading] = useState(false);
  const [newTodoDialog, setNewTodoDialog] = useState(false);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const { data } = await axios.get(
      process.env.REACT_APP_API_URL +
      `/api/todos?page=${page}&limit=${limit}&sortBy=${sortBy}&filter=${filter}`
    );
    setTodos(data.todos);
    setTotalPages(data.totalPages);
    setTotalTodos(data.total);
    setLoading(false);
  }, [page, limit, sortBy, filter]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const openTodoDialog = () => {
    setNewTodoDialog(true);
    console.log("openTodoDialog");
  };

  const closeTodoDialog = () => {
    setNewTodoDialog(false);
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
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6">Kadince TODO</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm">
        <Box my={4}>
          {/* Calendar Section */}
          <Typography variant="h5" align="center" gutterBottom>
            {formatDate(new Date())}
          </Typography>
          {/* Filter */}
          <ToggleButtonGroup
            value={filter}
            exclusive
            onChange={handleFilterChange}
            fullWidth
            style={{ marginBottom: "10px" }}
          >
            <ToggleButton value="all">
              All {filter === "all" ? "(" + totalTodos + ")" : ""}
            </ToggleButton>
            <ToggleButton value="pending">
              Pending {filter === "pending" ? "(" + totalTodos + ")" : ""}
            </ToggleButton>
            <ToggleButton value="complete">
              Complete {filter === "complete" ? "(" + totalTodos + ")" : ""}
            </ToggleButton>
          </ToggleButtonGroup>
          {/* Pagination */}
          <Box display="flex" justifyContent="center" mt={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
          <Box
            display="flex"
            justifyContent="center"
            gap={3}
            alignItems="center"
            mb={2}
            mt={2}
          >
            <Typography variant="body1">Tasks per page:</Typography>
            <Select size="small" value={limit} onChange={handleLimitChange}>
              <MenuItem value={5}>5</MenuItem>
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
            <Typography variant="body1">Sort by:</Typography>
            <Select size="small" value={sortBy} onChange={handleSortChange}>
              <MenuItem value="createdAt">Creation Date</MenuItem>
              <MenuItem value="priority">Priority</MenuItem>
              <MenuItem value="dueDate">Due Date</MenuItem>
            </Select>
          </Box>
          <TodoList
            todos={todos}
            fetchTodos={fetchTodos}
            setLoading={setLoading}
            loading={loading}
          />
        </Box>
      </Container>
      <Box
        display="flex"
        justifyContent="center"
        position="fixed"
        bottom="20px"
        right="20px"
      >
        {loading && <CircularProgress />}
        <IconButton
          variant="contained"
          color="primary"
          onClick={openTodoDialog}
        >
          <Icon color="primary" sx={{ fontSize: 60 }}>
            add_circle
          </Icon>
        </IconButton>
      </Box>
      <Dialog open={newTodoDialog} onClose={closeTodoDialog} fullWidth>
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          New Task
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={closeTodoDialog}
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
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default App;
