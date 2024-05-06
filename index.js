const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const { db } = require('./lib/db');
const { posts } = require('./lib/schema');

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());

// CORS setup
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Swagger setup
const swaggerDocument = YAML.load('./swagger.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// Get all posts

app.get('/posts', async (req, res) => {
  try {
    const data = await db.select().from(posts).all();
    res.setHeader('Cache-Control', 'public, max-age=3600'); // this Cache for 1 hour
    res.json(data);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add a new post
app.post('/posts', async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const data = { title, description, category };

    await db.insert(posts).values(data);

    res.setHeader('Cache-Control', 'no-store'); // Do not cache response
    res.json({ message: 'Post created successfully', data });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
