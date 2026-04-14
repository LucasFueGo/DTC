const getDestinyProfileInfo = async (bungieMembershipId, apiKey) => {
    const url = `https://www.bungie.net/Platform/User/GetMembershipsById/${bungieMembershipId}/-1/`;
    const response = await fetch(url, { headers: { 'X-API-Key': apiKey } });
    const data = await response.json();
    
    if (data.ErrorCode !== 1) throw new Error("Compte Bungie introuvable");

    const memberships = data.Response.destinyMemberships;
    if (!memberships?.length) throw new Error("Aucun profil Destiny trouvé");

    let activeAccount = memberships[0];
    const primaryType = memberships[0].crossSaveOverride;
    
    if (primaryType !== 0) {
        activeAccount = memberships.find(m => m.membershipType === primaryType) || memberships[0];
    }

    return {
        destinyMembershipId: activeAccount.membershipId,
        membershipType: activeAccount.membershipType,
        displayName: activeAccount.bungieGlobalDisplayName || activeAccount.displayName
    };
};

export const exchangeToken = async (req, res) => {
    const { code } = req.body;
    const API_KEY = process.env.BUNGIE_API_KEY.trim();
    const CLIENT_ID = process.env.BUNGIE_CLIENT_ID.trim();
    const CLIENT_SECRET = process.env.BUNGIE_CLIENT_SECRET.trim();

    try {
        const bodyParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET
        });

        const authRes = await fetch('https://www.bungie.net/Platform/App/OAuth/Token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: bodyParams
        });
        const authData = await authRes.json();

        if (authData.error) return res.status(400).json({ error: authData.error_description });

        const profile = await getDestinyProfileInfo(authData.membership_id, API_KEY);

        res.json({
            accessToken: authData.access_token,
            refreshToken: authData.refresh_token,
            destinyMembershipId: profile.destinyMembershipId,
            membershipType: profile.membershipType,
            displayName: profile.displayName
        });

    } catch (error) {
        res.status(500).json({ error: "Échec de l'identification Destiny" });
    }
};