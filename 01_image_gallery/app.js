const SERVER_URL = 'http://localhost:3000';

let isFavoritesTab = false;

async function renderGallery(images) {
    const gallery = document.getElementById('galleryContainer');
    gallery.innerHTML = ''; // Clear previous images
    images.forEach((result) => {
        console.log('Rendering image:', result);
        const item = document.createElement('div');
        item.classList.add('gallery-item');

        const img = document.createElement('img');
        console.log('Adding class:', img.classList); // Debugging line
        img.src = result;

        const heartIcon = document.createElement('span');
        heartIcon.classList.add('heart-icon');
        heartIcon.innerHTML = '❤️';
        heartIcon.addEventListener('click', () => saveToFavorites(result));

        item.appendChild(img);
        item.appendChild(heartIcon);
        gallery.appendChild(item);
    });
}

function saveToFavorites(image) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(image)) {
        favorites.push(image);
        alert('Image added to favorites!');
    } else {
        favorites = favorites.filter(fav => fav !== image);
        alert('Image erased from favorites!');
        if (isFavoritesTab) {
            renderGallery(favorites);
        }
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    isFavoritesTab = true;
    renderGallery(favorites);
}

function renderAllImages(images) {
    isFavoritesTab = false;
    renderGallery(images);
}

const saved = document.getElementById('saved');
saved.addEventListener('click', renderFavorites);

async function fetchImages(query) {
    let images = [];
    try {
        const response = await fetch(`${SERVER_URL}/get_unsplash_urls?search=${query}`);
  //        const response = await fetch(`https://api.unsplash.com/search/photos?query=${query}&client_id=${apiKey}`);
        images = await response.json(); // data is an array of image URLs
    } catch (error) {
        console.error('Error fetching images', error);
    }
    return images;
}

function setupSearchForm() {
    const form = document.getElementById('search-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');
        const input = document.getElementById('search-input');
        const query = input.value;
        input.value = '';
        const images = await fetchImages(query);
        renderGallery(images);
    });
}


function authenticate() {
    console.log('Authenticating...');
    window.location.href = `${SERVER_URL}/auth/unsplash`;
}

async function checkAuthentication() {
    try {
        console.log('Checking authentication...');
        const response = await fetch(`${SERVER_URL}/auth/check`, {
            credentials: 'include', // Send cookies with the request
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            console.error('Authentication failed:', response.status);
            toggleAuthenticationUI(false);
            return;
        }

        const data = await response.json();
        console.log('Authentication data:', data);

        toggleAuthenticationUI(data.authenticated);
    } catch (error) {
        console.error('Error checking authentication', error);
        toggleAuthenticationUI(false);
    }
}

function toggleAuthenticationUI(isAuthenticated) {
    const form = document.getElementById('search-form');
    const logMsg = document.getElementById('log-req');
    const logInBtn = document.getElementById('login-btn');
    const logOutBtn = document.getElementById('logout-btn');
    const gallery = document.getElementById('galleryContainer');
    const saved = document.getElementById('saved');

    if (!isAuthenticated) {
        console.log('User is not authenticated');
        form.style.display = 'none'; // Hide the form
        logMsg.style.display = 'block'; // Show the login message
        logInBtn.style.display = 'block'; // Show the login button
        logOutBtn.style.display = 'none'; // Hide the logout button
        gallery.style.display = 'none'; // Hide the gallery
        saved.style.display = 'none'; // Hide the saved images
    } else {
        console.log('User is authenticated');
        form.style.display = 'block'; // Show the form
        logMsg.style.display = 'none'; // Hide the login message
        logInBtn.style.display = 'none'; // Hide the login button
        logOutBtn.style.display = 'block'; // Show the logout button
        saved.style.display = 'flex'; // Show the saved images
    }
}

async function logout() {
    
    try {
        const response = await fetch(`${SERVER_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include', // Send cookies with the request
        });

        if (response.ok) {
            console.log('Logged out successfully');
            toggleAuthenticationUI(false);
        } else {
            console.error('Logout failed:', response.status);
        }
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Call checkAuthentication on page load
window.addEventListener('load', checkAuthentication);

// Initialize the form event listener
setupSearchForm();
