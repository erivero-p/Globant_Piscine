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
        displayMap(coordinates);
        displayRecommendations(destination, coordinates);
    } catch (error) {
        resultDiv.textContent = 'An error occurred while fetching recommendations. Please try again.';
        console.error('Error:', error);
    }
    destinationInput.value = '';
});

async function getCoordinates(destination) {
    const prompt = "I'd like to go on a trip to " + destination + ". Can you give me the coordinates? DO NOT give me anything else but the coordinates, which should look like this: 40.4168, -3.7038 ";
    const response = await fetch(`${SERVER_URL}/coordinates?query=${encodeURIComponent(prompt)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            contents: [{
                parts: [{
                    text: prompt
                }]
            }]
        })
    });

    if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text.split('\n');
}

function displayRecommendations(recommendations) {
    resultDiv.innerHTML = `
        <h3>Recommendations for ${destinationInput.value}</h3>
        <ul class="list-group">
            ${recommendations.map(rec => `<li class="list-group-item">${rec}</li>`).join('')}
        </ul>
    `;
}