import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usersDataRoute from './routes/usersDataRoute.js';
import profileSetUpRoute from './routes/profileSetUpRoute.js'
import profileUpdateRoute from './routes/profileUpdateRoute.js'
import messageRoute from './routes/messageRoute.js'
import dotenv from 'dotenv';
import './cloudinary/cloudinaryConfig.js';

dotenv.config({ path: '.env.local' });
const app = express();

app
    .use(express.json())
    .use(cors({
        origin: process.env.CLIENT_URL,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));

app.use('/api/auth', authRoutes);
app.use('/api', usersDataRoute)
app.use('/api', profileSetUpRoute)
app.use('/api', profileUpdateRoute)
app.use('/api', messageRoute)

app.get('/', (req, res) => {
    res.send('Server Running!');
});

export default app;