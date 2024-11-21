import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Trip Recommender API');
});

app.get('/generate', async (req, res) => {
    const apiKey = process.env.API_KEY;
    const prompt = req.query.query;

    console.log('Prompt:', prompt);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [
                            {
                                text: prompt,
                            },
                        ],
                    },
                ],
            }),
        });

        if (!response.ok) {
            throw new Error(`Error from API: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        // Ajusta según el formato de la respuesta
        const coordinates = data.candidates[0]?.content?.parts[0]?.text.trim();
        res.json({ coordinates });
    } catch (error) {
        console.error('Error fetching coordinates:', error.message);
        res.status(500).json({
            error: 'An error occurred while fetching coordinates. Please try again later.',
        });
    }
});

app.get('/recommendations', async (req, res) => {

});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
