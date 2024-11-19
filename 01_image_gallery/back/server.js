import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';

dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// In-memory storage for simplicity
const stateStore = new Map();

app.get('/', (req, res) => {
  res.send('Hello 42!');
});

app.get('/get_unsplash_urls', async (req, res) => {
  const query = req.query['search'];
  const apiKey = process.env.UNSPLASH_ACCESS_KEY;

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

// OAuth2 endpoints

app.get('/auth/unsplash', (req, res) => {
    const state = crypto.randomBytes(16).toString('hex');
    stateStore.set(state, Date.now());
  
    const authUrl = new URL('https://unsplash.com/oauth/authorize');
    authUrl.searchParams.append('client_id', process.env.UNSPLASH_ACCESS_KEY);
    authUrl.searchParams.append('redirect_uri', process.env.UNSPLASH_REDIRECT_URI);
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('scope', 'public'); // Scopes ajustados
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
      // im gonna need to send the token to the frontend idk how
      res.cookie('unsplash_access_token', tokenData.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
      });
  
      res.redirect('http://127.0.0.1:5500/01_image_gallery/index.html');
    } catch (error) {
      console.error('Error in OAuth callback:', error);
      res.status(500).send('Internal server error during authentication');
    }
  });
  

// Example of an authenticated request
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});