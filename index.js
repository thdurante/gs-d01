const express = require('express');

const server = express();
server.use(express.json());

const projects = [];
let requestsCount = 0;

/**
 * Middleware
 * */

const checkExistingProject = (req, res, next) => {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);

  if (!project) return res.status(400).json({ errors: 'Project not found' });
  return next();
};

const countRequests = (req, res, next) => {
  requestsCount++;
  console.log(`Requests Count: ${requestsCount}`);

  return next();
};

server.use(countRequests);

/**
 * Projects
 * */

server.get('/projects', (req, res) => {
  res.json(projects);
});

server.post('/projects', (req, res) => {
  const { id, title } = req.body;

  const project = { id, title, tasks: [] };
  projects.push(project);

  res.status(201).json(project);
});

server.put('/projects/:id', checkExistingProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.title = title;

  res.json(project);
});

server.delete('/projects/:id', checkExistingProject, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);

  res.send();
});

/**
 * Tasks
 * */

server.post('/projects/:id/tasks', checkExistingProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  project.tasks.push(title);

  res.json(project);
});

server.listen(3000);
