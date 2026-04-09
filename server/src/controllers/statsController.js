export const D1PlayTime = async (req, res) => {
    const API_KEY = process.env.BUNGIE_API_KEY.trim();
    const { membership_id, membership_type } = req.body; 

    if (!membership_id || !membership_type) {
        return res.status(400).json({ error: "membership_id et membership_type sont requis." });
    }

    try {
        const baseUrl = `https://www.bungie.net/Platform/Destiny/${membership_type}/Account/${membership_id}/Summary/`;
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
    const { membership_id, membership_type,token } = req.body;
    const API_KEY = process.env.BUNGIE_API_KEY.trim();

    if (!membership_id || !membership_type) {
        return res.status(400).json({ error: "membership_id et membership_type sont requis." });
    }

    try {
        const url = `https://www.bungie.net/Platform/Destiny2/${membership_type}/Profile/${membership_id}/?components=200,900`;

        const requestHeaders = {
            'X-API-Key': API_KEY
        };
        if (token) {
            requestHeaders['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            headers: requestHeaders
        });

        const data = await response.json();

        if (data.ErrorCode !== 1) {
            return res.status(400).json({ error: data.Message });
        }

        const activeTriumphScore = data.Response.profileRecords?.data?.activeScore || 0;
        const lifetimeTriumphScore = data.Response.profileRecords?.data?.lifetimeScore || 0;

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
            characters: formattedCharacters,
            triumphScore: activeTriumphScore,
            lifetimeScore: lifetimeTriumphScore
        });

    } catch (error) {
        res.status(500).json({ error: "Erreur lors de la communication avec Bungie" });
    }
};