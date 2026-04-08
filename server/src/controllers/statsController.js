import prisma from '../config/db.js';

export const playTime = async (req, res) => {
    // const userId = req.user.userId;
    // const { name } = req.body;

    const API_KEY = process.env.BUNGIE_API_KEY.trim();
    const MEMBERSHIP_TYPE = process.env.MEMBERSHIP_TYPE.trim();
    const MEMBERSHIP_ID = process.env.MEMBERSHIP_ID.trim();

    try {
        const url = `https://www.bungie.net/Platform/Destiny2/${MEMBERSHIP_TYPE}/Profile/${MEMBERSHIP_ID}/?components=200`;

        console.log("URL envoyée à Bungie :", url);

        const response = await fetch(url, {
            headers: {
                'X-API-Key': API_KEY
            }
        });

        const data = await response.json();
        
        res.json(data);

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la communication avec Bungie" });
    }
};