import React, { useState, useEffect, useCallback } from "react";
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
  Dialog,
  IconButton,
  DialogContent,
  DialogTitle,
  Grid,
  Link,
} from "@mui/material";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import "./App.css";
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import todoService from "./services/todoService";

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
  const [limit, setLimit] = useState(10);
  const [sortBy, setSortBy] = useState("createdAt");
  const [loading, setLoading] = useState(false);
  const [newTodoDialog, setNewTodoDialog] = useState(false);

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    const { data } = await todoService.getTodos(page, limit, sortBy, filter);
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
  };

  const closeTodoDialog = () => {
    setNewTodoDialog(false);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
    setPage(1);
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter) {
      setFilter(newFilter);
      if (newFilter === "mixed") {
        setSortBy("priority");
      }
      setPage(1);
    }
  };

  return (
    <>
      <AppBar position="static" color="secondary">
        <Toolbar>
          <Typography variant="h6">Kadince TODO</Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="sm" style={{ paddingBottom: "50px" }}>
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
            <ToggleButton id="listItem" value="all">
              All {filter === "all" ? "(" + totalTodos + ")" : ""}
            </ToggleButton>
            <ToggleButton id="listItem" value="pending">
              Pending {filter === "pending" ? "(" + totalTodos + ")" : ""}
            </ToggleButton>
            <ToggleButton id="listItem" value="complete">
              Complete {filter === "complete" ? "(" + totalTodos + ")" : ""}
            </ToggleButton>
          </ToggleButtonGroup>
          <Box mt={2} mb={2}>
            <Grid container spacing={2} alignItems="center" justifyContent="center">
              <Grid item xs={12} sm="auto">
                <Typography variant="body1" align="center">
                  Tasks per page:
                </Typography>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Select
                  size="small"
                  value={limit}
                  onChange={handleLimitChange}
                  fullWidth
                >
                  <MenuItem value={5}>5</MenuItem>
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={20}>20</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Typography variant="body1" align="center">
                  Sort by:
                </Typography>
              </Grid>
              <Grid item xs={12} sm="auto">
                <Select
                  size="small"
                  value={sortBy}
                  onChange={handleSortChange}
                  fullWidth
                >
                  <MenuItem value="createdAt">Creation Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="dueDate">Due Date</MenuItem>
                </Select>
              </Grid>
            </Grid>
          </Box>
          {/* Pagination */}
          {totalTodos > 5 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
          {totalTodos < 1 && (
            <Box display="flex" justifyContent="center" mt={2}>
              <Typography variant="body1" align="center">
                You don't have any tasks yet. &nbsp;
                <br />
                <Link href="#" onClick={openTodoDialog}>
                  Create your first task
                </Link>
              </Typography>
            </Box>
          )}
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
        <IconButton
          size="large"
          id="btn-green"
          variant="contained"
          color="primary"
          onClick={openTodoDialog}
        >
          <AddIcon />
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
            onClose={closeTodoDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default App;
