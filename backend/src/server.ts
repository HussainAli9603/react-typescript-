import express from 'express';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import connectDB from './database';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();


app.use(cors({
  origin: '*',
  // origin: ['https://portfolio-frontend-swart.vercel.app'],
  methods: ['POST', 'GET', 'PUT', 'DELETE', 'FETCH'],
  credentials: true
  // timeout: 10000 // 10 seconds
}));

// Middleware
app.use(bodyParser.json());

// Middleware and routes
app.use(express.json());

dotenv.config();

// Connect to MongoDB
connectDB();

// Use cookie-parser middleware
app.use(cookieParser());

// Routes
app.use('/api/v1', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the login and registration API');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
