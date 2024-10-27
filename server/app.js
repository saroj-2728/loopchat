import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import usersDataRoute from './routes/usersDataRoute.js';

const app = express();

app
    .use(express.json())
    .use(cors({
        // origin: 'https://next-js-chat-app-5lgs.vercel.app',
        origin: 'http://localhost:3000',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }));

app.use('/api/auth', authRoutes);
app.use('/api', usersDataRoute)

app.get('/', (req, res) => {
    res.send('Server Running!');
});

export default app;