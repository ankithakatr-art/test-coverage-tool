import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze.js';

dotenv.config();

console.log('KEY:', process.env.OPENAI_API_KEY);

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(cors());
app.use(express.json());

app.use('/api', analyzeRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});