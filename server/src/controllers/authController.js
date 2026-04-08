import bcrypt from 'bcryptjs';
import prisma from '../config/db.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { name, password } = req.body;
    try {
        const existingUser = await prisma.user.findUnique({ where: { name } });
        if (existingUser) return res.status(400).json({ error: "Ce nom est déjà utilisé." });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: { name, password: hashedPassword }
        });

        res.status(201).json({ 
            user: { id: newUser.id, name: newUser.name } 
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la création du compte." });
    }
};

export const login = async (req, res) => {
    const { name, password } = req.body;
    if (!name || !password) return res.status(400).json({ error: "Name and password required" });

    try {
        const user = await prisma.user.findUnique({ where: { name } });
        if (!user) return res.status(404).json({ error: "incorrect name/password" }); 

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "incorrect name/password" });

        const token = jwt.sign(
            { userId: user.id }, 
            process.env.JWT_SECRET, 
            { expiresIn: '24h' }
        );

        res.status(200).json({
            token, 
            user: { id: user.id, name: user.name } 
        });
    } catch (error) {
        res.status(500).json({ error: "Erreur serveur" });
    }
};

export const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { id: true, name: true }
        });

        if (!user) return res.status(404).json({ error: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: "Server error" });
    }
};