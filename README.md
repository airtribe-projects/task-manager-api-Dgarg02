# Task Manager API

A RESTful API for managing tasks built with Flask.

## API Endpoints

### Tasks

#### GET /tasks
- Retrieves all tasks
- Returns list of task objects

#### GET /tasks?completed=true || /tasks?completed=false
- Filter the task based on status  

#### GET /tasks/{id}
- Retrieves a specific task by ID
- Returns single task object

#### POST /tasks
- Creates a new task
- Request body: 
    ```json
    {
        "title": "string",
        "description": "string",
        "due_date": "string",
        "status": "string"
    }
    ```

#### PUT /tasks/{id}
- Updates an existing task
- Request body: Same as POST

#### DELETE /tasks/{id}
- Deletes a specific task
- Returns success message

