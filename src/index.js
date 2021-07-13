const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

 const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;
  const user = users.find(users => users.username === username);
  if(!user){
    return response.status(400).json({ error: "username not found" });
  }
  request.user = user;
  return next();
}

app.post('/users', (request, response) => {
  const { name, username } = request.body;

  const verifyIfExistsUser = users.find(users => users.username === username);
  
  if(verifyIfExistsUser){
    return response.status(400).json({ error: "username already exists" });
  }
  
  user = {
    id: uuidv4(),
    name,
    username,
    todos: []
  }
  
  users.push(user)

  response.json(user).status(201)
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;

  response.json(user.todos)
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;

  const todo = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(deadline),
    created_at: new Date(),
  }

  user.todos.push(todo)

  response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    response.status(404).json({ error: "todo not found" })
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.json(todo)
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todo = user.todos.find(todo => todo.id === id);

  if(!todo){
    response.status(404).json({ error: "todo not found" })
  }

  todo.done = true;

  return response.json(todo)
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const todoIndex = user.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1){
    response.status(404).json({ error: "todo not found" })
  }
  
  user.todos.splice(todoIndex, 1)

  response.send(204);
  console.log(todoIndex);
});

module.exports = app;