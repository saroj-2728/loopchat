import express from 'express';
import cors from 'cors';
import userInfoRoute from './routes/userInfoRoute.js';
import usersDataRoute from './routes/usersDataRoute.js';
import profileControlRoute from './routes/profileControlRoute.js'
import messageRoute from './routes/messageRoute.js'
import friendsRoute from './routes/friendsRoute.js'
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

app.use('/api/user', userInfoRoute);
app.use('/api', usersDataRoute)
app.use('/api', profileControlRoute)
app.use('/api', messageRoute)
app.use('/api/friends', friendsRoute)

app.get('/', (req, res) => {
    res.send('Server Running!');
});

export default app;