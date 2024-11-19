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

// Initialize the form event listener
setupSearchForm();