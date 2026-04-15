export const getCharacterEquipment = async (req, res) => {
    const { membership_id, membership_type, character_id } = req.body;
    const API_KEY = process.env.BUNGIE_API_KEY.trim();

    try {
        const url = `https://www.bungie.net/Platform/Destiny2/${membership_type}/Profile/${membership_id}/?components=205,300`;
        
        const response = await fetch(url, { headers: { 'X-API-Key': API_KEY } });
        const data = await response.json();

        if (data.ErrorCode !== 1) return res.status(400).json({ error: data.Message });

        const equipment = data.Response.characterEquipment.data[character_id].items;
        const instances = data.Response.itemComponents.instances.data;

        const validBuckets = [
            1498876634, // Cinétique
            2465295065, // Énergétique
            953998645,  // Puissante
            3448274439, // Casque
            3551918588, // Gantelets
            14239492,   // Torse
            20886954,   // Jambes
            1585787867  // Objet de classe
        ];

        const filteredEquipment = equipment.filter(item => validBuckets.includes(item.bucketHash));

        const results = await Promise.allSettled(filteredEquipment.map(async (item) => {
            const manifestUrl = `https://www.bungie.net/Platform/Destiny2/Manifest/DestinyInventoryItemDefinition/${item.itemHash}/`;
            const manifestRes = await fetch(manifestUrl, { headers: { 'X-API-Key': API_KEY } });
            const manifestData = await manifestRes.json();
            const itemDef = manifestData.Response;

            if (!itemDef) throw new Error(`Manifest introuvable pour hash ${item.itemHash}`);

            const instanceData = item.itemInstanceId ? instances[item.itemInstanceId] : null;

            return {
                hash: item.itemHash,
                name: itemDef.displayProperties.name,
                icon: `https://www.bungie.net${itemDef.displayProperties.icon}`,
                tierType: itemDef.inventory.tierTypeName,
                itemType: itemDef.itemTypeDisplayName,
                lightLevel: instanceData?.primaryStat?.value || "-",
                bucketHash: item.bucketHash
            };
        }));

        const populatedItems = results
            .filter(r => {
                if (r.status === 'rejected') console.warn("Item ignoré :", r.reason?.message);
                return r.status === 'fulfilled';
            })
            .map(r => r.value);

        res.json(populatedItems);

    } catch (error) {
        console.error("Erreur équipement :", error);
        res.status(500).json({ error: "Erreur lors de la récupération de l'équipement" });
    }
};