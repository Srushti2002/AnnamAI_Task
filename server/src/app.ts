import express from 'express';
import cors from 'cors';
import uploadRoutes from './routes/upload.route';
require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/upload', uploadRoutes);


export default app;
