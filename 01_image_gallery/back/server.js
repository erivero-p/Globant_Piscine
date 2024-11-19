import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(
	cors()
);

app.get('/', (req, res) => {
	res.send('Hello 42!');
});

app.get('/get_unsplash_urls', async (req, res) => {
    const query = req.query['search'];
    const apiKey = process.env.API_KEY;

    try {
        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`);
        if (!response.ok) {
            console.error('Error response from Unsplash API:', response.status, response.statusText);
            return res.status(response.status).send('Error fetching images from Unsplash');
        }
        const data = await response.json();

        let toSend = [];
        data.results.forEach((result) => {
            toSend.push(result.urls.small);
        });

        return res.send(toSend);
    } catch (error) {
        console.error('Error fetching images on back', error);
        return res.status(500).send('Error fetching images');
    }
});

app.listen(port, () => {
	console.log(`Server is running on port ${port}`);
});