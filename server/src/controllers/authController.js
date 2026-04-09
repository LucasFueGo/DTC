export const exchangeToken = async (req, res) => {
    const { code } = req.body; 
    
    const CLIENT_ID = process.env.BUNGIE_CLIENT_ID.trim();
    const CLIENT_SECRET = process.env.BUNGIE_CLIENT_SECRET.trim();

    if (!code) {
        return res.status(400).json({ error: "Code d'autorisation manquant." });
    }

    try {
        const bodyParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        });

        const response = await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: bodyParams
        });

        const data = await response.json();

        if (data.error) {
            console.error("Bungie OAuth Error:", data);
            return res.status(400).json({ 
                error: data.error_description || "Erreur lors de l'authentification avec Bungie" 
            });
        }

        res.json({
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            membershipId: data.membership_id
        });

    } catch (error) {
        console.error("Erreur Serveur (exchangeToken) :", error);
        res.status(500).json({ error: "Erreur interne lors de l'échange du token avec Bungie." });
    }
};