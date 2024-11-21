document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('destination-form');
    const destinationInput = document.getElementById('destination-input');
    const resultDiv = document.getElementById('result');
    const SERVER_URL = 'http://localhost:3000';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const destination = destinationInput.value.trim();
        if (!destination) return;

        resultDiv.textContent = 'Searching for recommendations...';
        try {
            const coordinates = await getCoordinates(destination);
            resultDiv.textContent = '';
            displayMap(coordinates);
            displayRecommendations(destination, coordinates);
        } catch (error) {
            resultDiv.textContent = 'An error occurred while fetching recommendations. Please try again.';
            console.error('Error:', error);
        }
        destinationInput.value = '';
    });

    async function getCoordinates(destination) {
        const prompt = `I'd like to go on a trip to ${destination}. Can you give me the coordinates? DO NOT give me anything else but the coordinates, which should look like this: 40.4168, -3.7038`;
        console.log("destination: ", destination);

        const response = await fetch(`${SERVER_URL}/generate?query=${encodeURIComponent(prompt)}`);

        if (!response.ok) {
            throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        return data.coordinates;
    }

    
    async function displayRecommendations(destination, coordinates) {
        const prompt = `I'm going on a trip to the coordinates ${coordinates}. Can you recommend me some places to visit,
        knowing that my priorities are ${destination}?. Please, return the response in a <ul> html format, with a <h3> for the city name, so 
        I can append it directly to my html body`;
    
        try {
            const response = await fetch(`${SERVER_URL}/generate?query=${encodeURIComponent(prompt)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            const result = document.getElementById('result');
            const responseText = await response.text();
            const recommendations = document.createElement('div');
            recommendations.innerHTML = parseResponse(responseText);
            result.appendChild(recommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
            resultDiv.textContent = 'An error occurred while fetching recommendations. Please try again.';
        }
    }

    function parseResponse(response) {
        const withoutHeader = response.replace(/^\{"coordinates":"```html\\n/, '');    
        const trimed = withoutHeader.replace(/\\n/g, '').replace(/```$/, '').trim();
        const cleaned = trimed.replace(/```"?}\s*$/g, '')
        return cleaned;
    }
    
    
    function displayMap(coordinates) {
        const resultDiv = document.getElementById('result');
    
        // Crea dinámicamente el contenedor del mapa si no existe.
        let mapContainer = document.getElementById('map');
        if (!mapContainer) {
            mapContainer = document.createElement('div');
            mapContainer.id = 'map';
            mapContainer.style.width = '100%';
            mapContainer.style.height = '400px';
            resultDiv.appendChild(mapContainer);
        }
    
        const [lat, lng] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
        const map = L.map('map').setView([lat, lng], 13);
    
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);
    
        L.marker([lat, lng]).addTo(map)
            .bindPopup(`${coordinates}`)
            .openPopup();
    }    
});

/* function displayRecommendations(recommendations) {
    resultDiv.innerHTML = `
        <h3>Recommendations for ${destinationInput.value}</h3>
        <ul class="list-group">
            ${recommendations.map(rec => `<li class="list-group-item">${rec}</li>`).join('')}
        </ul>
    `;
} */