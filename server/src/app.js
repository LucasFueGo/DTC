import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import equipmentRoutes from './routes/equipmentRoutes.js';

dotenv.config();

const app = express();

const allowedOrigins = [
    process.env.ORIGIN,                      
    'https://dtc-seven.vercel.app/Auth',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://localhost:5173',
    'https://localhost:3000'
];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        const cleanOrigin = origin.replace(/\/$/, "");
        const isAllowed = allowedOrigins.some(o => o && o.replace(/\/$/, "") === cleanOrigin);

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/ping', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).send('pong & db alive');
    } catch (error) {
        res.status(200).send('pong (db error)'); 
    }
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/equipment', equipmentRoutes);

export default app;