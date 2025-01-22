import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL + "/api/todos";

const todoService = {
    getTodos: async (searchString, page, limit, sortBy, filter) => {
        const response = await axios.get(API_URL, {
            params: { searchString, page, limit, sortBy, filter },
        });
        return response;
    },

    createTodo: async (todoData) => {
        const response = await axios.post(API_URL, todoData);
        return response;
    },

    updateTodo: async (id, todoData) => {
        const response = await axios.put(`${API_URL}/${id}`, todoData);
        return response;
    },

    deleteTodo: async (id) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response;
    },

    toggleComplete: async (id, isCompleted) => {
        const response = await axios.put(`${API_URL}/${id}`, { isCompleted });
        return response;
    },
};

export default todoService;
