let isAuthenticated = true;

document.addEventListener('DOMContentLoaded', () => {
    isAuthenticated = localStorage.getItem("accessToken") !== null;
    setupEventListeners();
    populateRecentlyPlayed();
    populatePlaylistsForYou();
});

function setupEventListeners() {
    document.getElementById('loginBtn').addEventListener('click', handleSignIn);
    document.getElementById('search-form').addEventListener('input', handleSearchInput);
}

function handleSignIn() {
    alert("Logged in successfully");
    toggleAuthentication();
}

function handleSearchInput(event) {
    const searchText = event.target.value;
    const searchIcon = document.getElementById('search-icon');
    if (searchText === "") {
        searchIcon.classList.replace('fa-times', 'fa-folder-open');
        searchIcon.onclick = null;
    } else {
        searchIcon.classList.replace('fa-folder-open', 'fa-times');
        searchIcon.onclick = clearSearch;
    }
}

function clearSearch() {
    const searchInput = document.getElementById('search-form');
    searchInput.value = "";
    handleSearchInput({ target: searchInput });
}

function toggleAuthentication() {
    isAuthenticated = !isAuthenticated;
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('user-menu');
    const mainContent = document.getElementById('main-content');
    const welcomeCard = document.getElementById('welcome-card');

    authButtons.style.display = isAuthenticated ? 'none' : 'block';
    userMenu.style.display = isAuthenticated ? 'block' : 'none';
    mainContent.style.display = isAuthenticated ? 'block' : 'none';
    welcomeCard.style.display = isAuthenticated ? 'none' : 'block';
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomGradient() {
    const color1 = getRandomColor();
    const color2 = getRandomColor();
    return `linear-gradient(to bottom right, ${color1}, ${color2})`;
}

function populateRecentlyPlayed() {
    const recentlyPlayedContainer = document.querySelector('#recently-played .grid');
    const recentlyPlayedSongs = [
        { title: "Florida!!!", artist: "Taylor Swift" },
        { title: "No Hard Feelings", artist: "Wolf Alice" },
        { title: "A Team", artist: "Ed Sheeran" },
        { title: "UFO", artist: "Olivia Dean" },
        { title: "Someone Like You", artist: "Adele" },
        { title: "Wasting my young years", artist: "London Grammar" },
        { title: "Dreams", artist: "Fleetwood Mac" },
        { title: "Chihiro", artist: "Billie Eilish" }
    ];

    recentlyPlayedSongs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'bg-gray-700 rounded-lg shadow-md flex items-center';
        const randomColor = getRandomColor();
        songCard.innerHTML = `
            <div class="h-14 w-14 mr-2 rounded-tl-md rounded-bl-md" style="background-color: ${randomColor};"></div>
            <h3 class="text-white font-semibold">${song.title}</h3>
        `;
        recentlyPlayedContainer.appendChild(songCard);
    });
}

function populatePlaylistsForYou() {
    const playlistsContainer = document.querySelector('#playlist-for-you .grid');
    const playlists = [
        { title: "Chill Vibes", description: "Relax and unwind with these smooth tracks" },
        { title: "Workout Mix", description: "High-energy songs to fuel your exercise" },
        { title: "90s Throwback", description: "Take a trip down memory lane" },
        { title: "Indie Discoveries", description: "Fresh finds from independent artists" },
        { title: "Classical Essentials", description: "Timeless compositions from the masters" },
        { title: "Party Anthems", description: "Get the party started with these hits" }
    ];

    playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'bg-gray-700 p-4 rounded-lg shadow-md';
        const randomGradient = getRandomGradient();
        playlistCard.innerHTML = `
            <div class="w-full h-40 rounded-md mb-2" style="background: ${randomGradient};"></div>
            <h3 class="text-white font-semibold">${playlist.title}</h3>
            <p class="text-gray-400 text-sm">${playlist.description}</p>
        `;
        playlistsContainer.appendChild(playlistCard);
    });
}