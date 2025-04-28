const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const data = fs.readFileSync('task.json', 'utf8');
const tasks = JSON.parse(data);



// console.log(tasks);

app.get('/tasks',(req,res)=>{
    const {completed} = req.query;
    if (completed) {
        const filteredTasks = tasks.tasks.filter(task => task.completed == (completed === 'true'));
        return res.json(filteredTasks);
    }
    if (tasks.tasks.length === 0) {
        return res.status(404).send('No tasks found');
    }
    res.json(tasks.tasks);
})

app.get('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    const task = tasks.tasks.find(task => task.id == id);
    if (task) {
        res.json(task);
    } else {
        res.status(404).send('Task not found');
    }
})

app.post('/tasks',(req,res)=>{
    const { title, description, completed } = req.body;
    if (!title || !description || typeof completed !== 'boolean') {
        return res.status(400).json({
            error: 'Title, description, and completed (boolean) fields are required.'
        });
    }
    const newTask = {
        id: tasks.tasks.length + 1,
        title,
        description,
        completed
    };
    tasks.tasks.push(newTask);
     try {
        fs.writeFileSync(
            path.join(__dirname, 'task.json'), 
            JSON.stringify(tasks, null, 2),
            'utf8'
        );
        res.status(201).json(newTask); 
    } catch (err) {
    console.error('Error writing file:', err);
    res.status(500).json({ error: 'Failed to save new task.' });
  }
})

app.put('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    const { title, description, completed } = req.body;
      if (!title || !description || typeof completed !== 'boolean') {
    return res.status(400).json({
      error: 'Title, description, and completed (boolean) fields are required.'
    });
  }
    const taskIndex = tasks.tasks.findIndex(task => task.id == id);


    if (taskIndex !== -1) {
        tasks.tasks[taskIndex].title = title;
        tasks.tasks[taskIndex].description = description;
        tasks.tasks[taskIndex].completed = completed;
        fs.writeFileSync('task.json', JSON.stringify(tasks, null, 2));
        res.status(200).json(tasks.tasks);
    } else {
        res.status(404).send('Task not found');
    }
})

app.delete('/tasks/:id',(req,res)=>{
    const id = req.params.id;
    const taskIndex = tasks.tasks.findIndex(task => task.id == id);
    if (taskIndex !== -1) {
        tasks.tasks.splice(taskIndex, 1);
        fs.writeFileSync('task.json', JSON.stringify(tasks, null, 2));
        res.status(200).json(tasks.tasks);
    } else {
        res.status(404).send('Task not found');
    }
})

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});



module.exports = app;