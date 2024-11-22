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
        const ability = document.getElementById('abilityInput').value;
        const type = document.getElementById('type').value;
        const prompt = `A pokemon with the form of a ${animal} of ${type} and the ability of ${ability}`;
        displayPokemonImage(prompt);
    }


    async function generateImage(prompt) {  
      try {
          const response = await fetch(`${SERVER_URL}/api/generate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ prompt })
          });
  
          if (!response.ok) {
              throw new Error("Error generating image: " + response.statusText);
          }
          const data = await response.json();
          if (data.images && data.images.length > 0) {
              return `data:image/png;base64,${data.images[0]}`; // Convertimos base64 a URL para uso directo en <img>
          } else {
              throw new Error("No images returned by the API.");
          }
      } catch (error) {
          console.error("Error in generateImage:", error);
          throw error;
      }
  }
  
  async function displayPokemonImage(prompt) {
    const pokemonImage = document.getElementById("pokemon-image");
    if (!pokemonImage) {
        console.error("Element with id 'pokemon-image' not found.");
        return;
    }

    // Mostrar mensaje de carga
    pokemonImage.innerHTML = "<p>Generating Pokémon image...</p>";

    try {
        const imageUrl = await generateImage(prompt);
        pokemonImage.innerHTML = `
            <img src="${imageUrl}" alt="Generated Pokémon" class="img-fluid rounded">
        `;
      } catch (error) {
      pokemonImage.innerHTML = `
          <img src="https://miro.medium.com/v2/0*ZjYSm_q36J4KChdn" alt="Generated Pokémon" class="img-fluid rounded">
      `;
        console.error("Error displaying Pokémon image:", error);
        alert("Could not generate Pokémon image. Please try again later.");
    }
}


    window.sharePokemon = function(imageUrl) {
        alert('Share functionality not yet implemented. Image URL: ' + imageUrl);
    };
});