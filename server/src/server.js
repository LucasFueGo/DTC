import app from './app.js';

const PORT = process.env.PORT || 3000;

const SERVER_URL = process.env.SERVER_URL;

app.listen(PORT, () => {
    const interval = 14 * 60 * 1000; 

    setInterval(() => {        
        fetch(`${SERVER_URL}/ping`)
            .then(response => {
                console.log(`Ping réussi ${response.status}`);
            })
            .catch(error => {
                console.error(`Ping raté ${error.message}`);
            });

    }, interval);
});