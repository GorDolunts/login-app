const express = require('express');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const logger = require('winston');
const cors = require('cors'); // Add CORS import

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Add CORS middleware
app.use(express.json());

// Add this route to verify server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Simple logger setup
logger.add(new logger.transports.Console({ format: logger.format.simple() }));

// Dummy "database" (JSON file for users)
const usersFilePath = path.join(__dirname, 'users.json');

// Helper to read users from file
function getUsers() {
  if (fs.existsSync(usersFilePath)) {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  }
  return [];
}

// Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  logger.info(`Login attempt with email: ${email}`);
  
  const users = getUsers();
  const user = users.find(user => user.email === email);
  if (!user) {
    logger.info('Login failed: User not found');
    return res.status(400).json({ message: 'User not found' });
  }

  bcrypt.compare(password, user.password, (err, result) => {
    if (err) {
      logger.error('Error during password comparison');
      return res.status(500).json({ message: 'Error during login' });
    }

    if (result) {
      logger.info(`User ${email} logged in successfully`);
      return res.status(200).json({ message: 'Login successful' });
    } else {
      logger.info('Login failed: Incorrect password');
      return res.status(400).json({ message: 'Incorrect password' });
    }
  });
});

// Register route
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  logger.info(`Register attempt with email: ${email}`);

  const users = getUsers();

  // Check if the user already exists
  if (users.find(user => user.email === email)) {
    logger.info('Registration failed: User already exists');
    return res.status(400).json({ message: 'User already exists' });
  }

  // Hash password and save the new user
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      logger.error('Error hashing password');
      return res.status(500).json({ message: 'Error hashing password' });
    }

    const newUser = {
      username,
      email,
      password: hashedPassword
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    logger.info(`User ${email} registered successfully`);
    res.status(201).json({ message: 'Registration successful' });
  });
});

// Start the server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
