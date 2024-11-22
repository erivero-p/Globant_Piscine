import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
const port = 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// In-memory storage for simplicity
const stateStore = new Map();


app.get('/', (req, res) => {
  res.send('pokeAPI API');
});

// Im reusing ImageGallery oauth for saving time
//but it will be more apropiate to make oauth with github or 42
 
app.get('/auth/unsplash', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    stateStore.set(state, Date.now());
  
    const authUrl = new URL('https://unsplash.com/oauth/authorize');
    authUrl.searchParams.append('client_id', process.env.UNSPLASH_ACCESS_KEY);
    authUrl.searchParams.append('redirect_uri', process.env.UNSPLASH_REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'public');
    authUrl.searchParams.append('state', state);
  
    res.redirect(authUrl.toString());
    console.log('Redirecting to:', authUrl.toString());
  });
  

    app.get('/auth/unsplash/callback', async (req, res) => {
        const { code, state } = req.query;
    
        if (!state || !stateStore.has(state)) {
            return res.status(400).send('Invalid state parameter');
        }
    
        stateStore.delete(state);
    
        try {
            const tokenResponse = await fetch('https://unsplash.com/oauth/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    client_id: process.env.UNSPLASH_ACCESS_KEY,
                    client_secret: process.env.UNSPLASH_SECRET_KEY,
                    redirect_uri: process.env.UNSPLASH_REDIRECT_URI,
                    code: code,
                    grant_type: 'authorization_code'
                })
            });
    
            if (!tokenResponse.ok) {
                console.error('Error exchanging code for token:', tokenResponse.status, tokenResponse.statusText);
                return res.status(tokenResponse.status).send('Error authenticating with Unsplash');
            }
    
            const tokenData = await tokenResponse.json();
            console.log('Setting cookie with token:', tokenData.access_token); // Log the token value
            res.cookie('unsplash_access_token', tokenData.access_token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax', // Ensure the cookie is sent with cross-site requests
            });
            console.log('Redirecting to gallery...');
            res.redirect('http://localhost:5173/');
        } catch (error) {
            console.error('Error in OAuth callback:', error);
            res.status(500).send('Internal server error during authentication');
        }
    });

app.get('/unsplash/me', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).send('No access token provided');
  }

  try {
    const response = await fetch('https://api.unsplash.com/me', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      console.error('Error fetching user data:', response.status, response.statusText);
      return res.status(response.status).send('Error fetching user data from Unsplash');
    }

    const userData = await response.json();
    res.json(userData);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Internal server error');
  }
});

app.get('/auth/check', (req, res) => {
    const token = req.cookies.unsplash_access_token;
    if (!token) {
        console.log('No token found');
        return res.status(401).json({ authenticated: false });
    }
    res.json({ authenticated: true });
});

app.post('/auth/logout', (req, res) => {
  res.clearCookie('unsplash_access_token', {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
  });
  res.status(200).send('Logged out');
  console.log('Logged out');
});

app.post('/api/generate', async (req, res) => {
  try {
      console.log("promt: ", req.body);
      console.log("generating image...");
      const requestBody = {
        ...req.body,
        width: 256,
        height: 256,
        steps: 20,
        cfg_scale: 5
      };
      // Im asking for so low resolution and only 20 steps because the API is slow
      const response = await fetch('http://stable-diffusion.42malaga.com:7860/sdapi/v1/txt2img', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
      });
      const data = await response.json();
      console.log("image generated!");
      res.json(data);
  } catch (error) {
      res.status(500).send({ error: 'Error connecting to Stable Diffusion API' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});