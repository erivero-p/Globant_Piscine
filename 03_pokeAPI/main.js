const SERVER_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const authButtons = document.getElementById('authButtons');
    const pokemonCreator = document.getElementById('pokemonCreator');
    const loginMessage = document.getElementById('loginMessage');
    const pokemonFormContainer = document.getElementById('pokemonFormContainer');
    const pokemonForm = document.getElementById('pokemonForm');
    const mainContent = document.getElementById('mainContent');

    // Handle authentication
    loginBtn.addEventListener('click', () => {
        window.location.href = `${SERVER_URL}/auth/unsplash`;
    });

    // Check if the user is authenticated when the page loads
    checkAuthentication();

    async function checkAuthentication() {
        try {
            const response = await fetch(`${SERVER_URL}/auth/check`, {
                credentials: 'include', // Send cookies with the request
            });

            if (!response.ok) {
                console.error('User not authenticated.');
                toggleAuthenticationUI(false);
                return;
            }

            const data = await response.json();
            toggleAuthenticationUI(data.authenticated);
        } catch (error) {
            console.error('Error checking authentication:', error);
            toggleAuthenticationUI(false);
        }
    }

    function toggleAuthenticationUI(isAuthenticated) {
        if (isAuthenticated) {
            authButtons.innerHTML = '<button class="btn bg-red-500 text-white px-4 py-2 rounded" id="logoutBtn">Log out</button>';
            document.getElementById('logoutBtn').addEventListener('click', logout);
            pokemonCreator.style.display = 'block';
            loginMessage.style.display = 'none';
            pokemonFormContainer.style.display = 'block';
        } else {
            authButtons.innerHTML = '<button class="btn bg-blue-500 text-white px-4 py-2 rounded" id="loginBtn">Log in</button>';
            document.getElementById('loginBtn').addEventListener('click', () => {
                window.location.href = `${SERVER_URL}/auth/unsplash`;
            });
            pokemonCreator.style.display = 'block';
            loginMessage.style.display = 'block';
            pokemonFormContainer.style.display = 'none';
        }
    }

    async function logout() {
        try {
            const response = await fetch(`${SERVER_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include', // Send cookies with the request
            });

            if (!response.ok) {
                throw new Error('Failed to log out');
            }

            toggleAuthenticationUI(false);
            alert('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out:', error);
            alert('Error logging out. Please try again.');
        }
    }

    pokemonForm.addEventListener('submit', (e) => {
        e.preventDefault();
        createPokemon();
    });

    function createPokemon() {
        const animal = document.getElementById('animalInput').value;
        const type = document.getElementById('typeInput').value;
        const ability = document.getElementById('abilityInput').value;
        const size = document.getElementById('sizeSelect').value;

        generatePokemonImage(animal, type, ability, size)
            .then(imageUrl => displayPokemonImage(imageUrl, animal, type, ability, size))
            .catch(error => alert('Error generating Pokémon: ' + error.message));
    }

    async function generatePokemonImage(animal, type, ability, size) {
        const query = `${animal} ${type}`;
        const api = `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_KEY}`;

        try {
            const response = await fetch(api);
            const data = await response.json();

            if (data.results && data.results.length > 0) {
                return data.results[0].urls.regular;
            } else {
                throw new Error('No images found for the specified animal.');
            }
        } catch (error) {
            console.error('Error fetching images from Unsplash:', error);
            throw error;
        }
    }

    function displayPokemonImage(imageUrl, animal, type, ability, size) {
        const pokemonImage = document.getElementById('pokemonImage');
        pokemonImage.innerHTML = `
            <img src="${imageUrl}" alt="Generated Pokémon" class="img-fluid rounded">
            <div class="mt-4">
                Here is a representation of your Pokémon: <strong>${animal}</strong>, type: <strong>${type}</strong>, ability: <strong>${ability}</strong>, size: <strong>${size}</strong>.
            </div>
            <button class="btn bg-blue-500 text-white px-4 py-2 rounded mt-3" onclick="sharePokemon('${imageUrl}')">Share Pokémon</button>
        `;
    }

    window.sharePokemon = function(imageUrl) {
        alert('Share functionality not yet implemented. Image URL: ' + imageUrl);
    };
});