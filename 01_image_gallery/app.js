const SERVER_URL = 'http://localhost:3000';

async function renderGallery(images) {
    const gallery = document.getElementById('galleryContainer');
    gallery.innerHTML = ''; // Clear previous images
    images.forEach((result) => {
        const img = document.createElement('img');
        img.src = result;
        gallery.appendChild(img);
    });
}


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
        const query = document.getElementById('search-input').value;
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

    if (!isAuthenticated) {
        console.log('User is not authenticated');
        form.style.display = 'none'; // Hide the form
        logMsg.style.display = 'block'; // Show the login message
        logInBtn.style.display = 'block'; // Show the login button
        logOutBtn.style.display = 'none'; // Hide the logout button
        gallery.style.display = 'none'; // Hide the gallery
    } else {
        console.log('User is authenticated');
        form.style.display = 'block'; // Show the form
        logMsg.style.display = 'none'; // Hide the login message
        logInBtn.style.display = 'none'; // Hide the login button
        logOutBtn.style.display = 'block'; // Show the logout button
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
