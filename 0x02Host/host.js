const express = require('express');
const axios = require('axios');

const app = express();
const port = 80;

const whitelist = ['mdisec.com'];

app.get('/', async (req, res) => {

    try {
        const { url } = req.query;

        // Parse url with native URL class and make sure we don't mess-up with URI parsing.
        const parsedUrl = new URL(url);

        // Make sure the URL is one of the white-listed domains !!
        if (whitelist.includes(parsedUrl.hostname)) {
            const response = await axios.get(url);

            res.json(response.data);
        } else {
            res.status(403).send('Forbidden: Hostname not in whitelist');
        }
    } catch (error) {
        if (error.request) {
            res.status(500).send('Internal Server Error');
        } else {
            res.status(400).send('Bad Request: Invalid URL');
        }
    }
});

app.get('/admin', async (req, res) => {
    const clientIP = req.ip;
    if (clientIP === '::1' || clientIP === '127.0.0.1' || clientIP === '::ffff:127.0.0.1') {
        res.send("Welcome to admin panel!")
    } else {
        res.status(403).send('Forbidden');
    }
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});