import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
    res.send('Trip Recomendator API');
});

app.get('/coordinates', async (req, res) => {

    const AI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = req.query.query;
    try {
        const response = await model.generateContent({ prompt: prompt });
        const coordinates = response.candidates[0].content.parts[0].text;
        console.log("successfull request, coordinates: ", coordinates);
        res.json({ coordinates });
    }
    catch (error) {
        console.error("Error: ", error);
        res.status(500).send("An error occurred while fetching recommendations. Please try again.");
    }
    
});
