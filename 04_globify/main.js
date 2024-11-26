let isAuthenticated = false;

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



function populateRecentlyPlayed() {
    const recentlyPlayedContainer = document.querySelector('#recently-played .grid');
    const recentlyPlayedSongs = [
        { title: "Shake It Off", artist: "Taylor Swift", cover: "https://example.com/cover1.jpg" },
        { title: "Blinding Lights", artist: "The Weeknd", cover: "https://example.com/cover2.jpg" },
        { title: "Shape of You", artist: "Ed Sheeran", cover: "https://example.com/cover3.jpg" },
        { title: "Dance Monkey", artist: "Tones and I", cover: "https://example.com/cover4.jpg" },
        { title: "Someone Like You", artist: "Adele", cover: "https://example.com/cover5.jpg" },
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", cover: "https://example.com/cover6.jpg" },
        { title: "Despacito", artist: "Luis Fonsi & Daddy Yankee ft. Justin Bieber", cover: "https://example.com/cover7.jpg" },
        { title: "Bad Guy", artist: "Billie Eilish", cover: "https://example.com/cover8.jpg" }
    ];

    recentlyPlayedSongs.forEach(song => {
        const songCard = document.createElement('div');
        songCard.className = 'bg-gray-700 p-4 rounded-lg shadow-md';
        songCard.innerHTML = `
            <img src="${song.cover}" alt="${song.title}" class="w-full h-32 object-cover rounded-md mb-2">
            <h3 class="text-white font-semibold">${song.title}</h3>
            <p class="text-gray-400 text-sm">${song.artist}</p>
        `;
        recentlyPlayedContainer.appendChild(songCard);
    });
}

function populatePlaylistsForYou() {
    const playlistsContainer = document.querySelector('#playlist-for-you .grid');
    const playlists = [
        { title: "Chill Vibes", description: "Relax and unwind with these smooth tracks", cover: "https://example.com/playlist1.jpg" },
        { title: "Workout Mix", description: "High-energy songs to fuel your exercise", cover: "https://example.com/playlist2.jpg" },
        { title: "90s Throwback", description: "Take a trip down memory lane", cover: "https://example.com/playlist3.jpg" },
        { title: "Indie Discoveries", description: "Fresh finds from independent artists", cover: "https://example.com/playlist4.jpg" },
        { title: "Classical Essentials", description: "Timeless compositions from the masters", cover: "https://example.com/playlist5.jpg" },
        { title: "Party Anthems", description: "Get the party started with these hits", cover: "https://example.com/playlist6.jpg" }
    ];

    playlists.forEach(playlist => {
        const playlistCard = document.createElement('div');
        playlistCard.className = 'bg-gray-700 p-4 rounded-lg shadow-md';
        playlistCard.innerHTML = `
            <img src="${playlist.cover}" alt="${playlist.title}" class="w-full h-40 object-cover rounded-md mb-2">
            <h3 class="text-white font-semibold">${playlist.title}</h3>
            <p class="text-gray-400 text-sm">${playlist.description}</p>
        `;
        playlistsContainer.appendChild(playlistCard);
    });
}