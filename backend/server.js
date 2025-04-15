const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connection');
const auth = require('./middleware/auth');

const userRoute = require('./routes/userRoute');
const tripRoute = require('./routes/tripRoute');
const openaiRoute = require('./routes/openaiRoute');

connectDB();

const app = express();

app.use(express.json());
app.use(cors());

// Public route
app.use('/api/users', userRoute);

// Protected routes
app.use('/api/trips', auth, tripRoute);
app.use('/api/openai', openaiRoute);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
