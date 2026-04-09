import prisma from '../config/db.js';

export const D1PlayTime = async (req, res) => {
    // const userId = req.user.userId;
    // const { name } = req.body;

    const API_KEY = process.env.BUNGIE_API_KEY.replace(/['"]/g, '').trim();
    const MEMBERSHIP_TYPE = process.env.MEMBERSHIP_TYPE.replace(/['"]/g, '').trim();
    const MEMBERSHIP_ID = process.env.MEMBERSHIP_ID.replace(/['"]/g, '').trim();

    try {
        const baseUrl = `https://www.bungie.net/Platform/Destiny/${MEMBERSHIP_TYPE}/Account/${MEMBERSHIP_ID}/Summary/`;
        const url = new URL(baseUrl);

        const response = await fetch(url.toString(), {
            headers: {
                'X-API-Key': API_KEY
            }
        });

        const data = await response.json();
        
        if (data.ErrorCode !== 1) {
            console.error("Bungie a renvoyé une erreur :", data);
            return res.status(400).json(data);
        }

        const classNames = {
            0: "Titan",
            1: "Chasseur",
            2: "Arcaniste"
        };

        const charactersArray = data.Response.data.characters;
        
        const formattedCharacters = [];
        let totalAccountMinutes = 0;

        for (const charData of charactersArray) {
            const base = charData.characterBase;
            const minutes = parseInt(base.minutesPlayedTotal, 10);
            
            totalAccountMinutes += minutes;

            formattedCharacters.push({
                characterId: base.characterId,
                className: classNames[base.classType] || "Inconnu",
                lightLevel: base.powerLevel,
                minutesPlayed: minutes,
                hoursPlayed: Math.floor(minutes / 60),
                emblemImage: `https://www.bungie.net${charData.emblemPath}` 
            });
        }

        res.json({
            global: {
                totalMinutes: totalAccountMinutes,
                totalHours: Math.floor(totalAccountMinutes / 60)
            },
            characters: formattedCharacters
        });

    } catch (error) {
        console.error("Erreur serveur :", error);
        res.status(500).json({ error: "Erreur lors de la communication avec Bungie" });
    }
};

export const D2PlayTime = async (req, res) => {
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

        if (data.ErrorCode !== 1) {
            return res.status(400).json({ error: data.Message });
        }

        const classNames = {
            0: "Titan",
            1: "Chasseur",
            2: "Arcaniste"
        };

        const charactersData = data.Response.characters.data;

        const formattedCharacters = [];
        let totalAccountMinutes = 0;

        for (const characterId in charactersData) {
            const char = charactersData[characterId];
            const minutes = parseInt(char.minutesPlayedTotal, 10);
            
            totalAccountMinutes += minutes;

            formattedCharacters.push({
                characterId: char.characterId,
                className: classNames[char.classType] || "Inconnu",
                lightLevel: char.light,
                minutesPlayed: minutes,
                hoursPlayed: Math.floor(minutes / 60),
                emblemImage: `https://www.bungie.net${char.emblemPath}` 
            });
        }
        
        res.json({
            global: {
                totalMinutes: totalAccountMinutes,
                totalHours: Math.floor(totalAccountMinutes / 60)
            },
            characters: formattedCharacters
        });

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la communication avec Bungie" });
    }
};