# Kadince TODO

This is a full-stack Todo App built with the MERN stack (MongoDB, Express, React, Node.js). The backend provides a RESTful API, and the frontend allows users to create, read, update, and delete tasks.

## Prerequisites

- Node.js installed on your machine.
- Docker installed to run MongoDB in a container.

---

### Step 1: Set Up MongoDB Using Docker

Run the following command to create and start a MongoDB instance using Docker:

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo
```

**Details:**
- `-d`: Run the container in detached mode.
- `--name mongodb`: Name the container "mongodb".
- `-p 27017:27017`: Expose port 27017 to your host machine.
- `-e MONGO_INITDB_ROOT_USERNAME`: Set the root username (default: "admin").
- `-e MONGO_INITDB_ROOT_PASSWORD`: Set the root password (default: "password").

After running the command, MongoDB will be accessible at `mongodb://localhost:27017`.

---

### Step 2: Set Up the Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Create a `.env` file and add the following environment variables:

   ```env
   MONGO_URI=mongodb://admin:password@localhost:27017/
   PORT=5000
   ```

3. Install backend dependencies:

   ```bash
   npm install
   ```

4. Start the backend server:

   ```bash
   npm start
   ```

The backend will run on `http://localhost:5000`.

---

### Step 3: Set Up the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

The frontend will run on `http://localhost:3000`.

---

## Endpoints

### Backend API

- `GET /api/todos` - Retrieve all todos.
- `POST /api/todos` - Create a new todo.
- `PUT /api/todos/:id` - Update an existing todo.
- `DELETE /api/todos/:id` - Delete a todo.

---

## Running the Application

1. Ensure the MongoDB container is running:

   ```bash
   docker ps
   ```

   If the container is not running, start it:

   ```bash
   docker start mongodb
   ```

2. Start the backend and frontend servers as outlined above.
3. Open your browser and navigate to `http://localhost:3000` to use the app.

---

## Notes

- Make sure to replace the `MONGO_URI` in the `.env` file with your MongoDB connection string if using a custom setup.
- If you encounter issues, check that Docker is running and MongoDB is accessible.

---

## Deployment

### Backend

- Deploy the backend using services like Heroku, Railway, or Render.
- Ensure your MongoDB instance is hosted and accessible remotely.

### Frontend

- Deploy the frontend using services like Netlify or Vercel.
- Update the API URL in the frontend to point to the deployed backend.

---

Enjoy building and expanding the app!

