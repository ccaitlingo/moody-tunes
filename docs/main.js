class Playlist {
    constructor(name, happiness, angst, energy, indie, sexy) {
        this.name = name;
        this.attributes = {
            happiness: parseInt(happiness),
            angst: parseInt(angst),
            energy: parseInt(energy),
            indie: parseInt(indie),
            sexy: parseInt(sexy)
        };
    }
}

// Convert raw playlist objects to Playlist instances
const playlists = playlists_test.map(p => new Playlist(p.name, p.happiness, p.angst, p.energy, p.indie, p.sexy));

const attributes = [
    ['happiness', 'How happy are you feeling?'],
    ['angst', 'How angsty are you feeling?'],
    ['energy', 'How energetic are you feeling?'],
    ['indie', 'How indie do you want the playlist to be?'],
    ['sexy', 'How sexy/sassy are you feeling?']
];

// Create sliders dynamically
function createSliders() {
    const slidersDiv = document.getElementById('sliders');
    attributes.forEach(([attr, labelText]) => {
        const container = document.createElement('div');
        container.className = 'slider-container';

        const label = document.createElement('label');
        label.textContent = labelText;
        label.htmlFor = attr;

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = attr;
        slider.min = 1;
        slider.max = 5;
        slider.value = 3; // default
        slider.addEventListener('input', updateRecommendations);

        const valueDisplay = document.createElement('span');
        valueDisplay.id = `${attr}-value`;
        valueDisplay.textContent = slider.value;

        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });

        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);

        slidersDiv.appendChild(container);
    });
}

// Get current slider values
function getUserPreferences() {
    const prefs = {};
    attributes.forEach(([attr, _]) => {
        const slider = document.getElementById(attr);
        prefs[attr] = parseInt(slider.value);
    });
    return prefs;
}

// Calculate playlist score
function scorePlaylist(playlist, userPrefs) {
    return Object.keys(userPrefs).reduce((sum, attr) => {
        const diff = playlist.attributes[attr] - userPrefs[attr];
        return sum + diff * diff;
    }, 0);
}

// Recommend top N playlists
function recommendPlaylists(userPrefs, topN = 3) {
    return playlists
        .map(p => ({ playlist: p, score: scorePlaylist(p, userPrefs) }))
        .sort((a, b) => a.score - b.score)
        .slice(0, topN)
        .map(obj => obj.playlist);
}

// Update recommendations on slider change
function updateRecommendations() {
    const userPrefs = getUserPreferences();
    const topPlaylists = recommendPlaylists(userPrefs);

    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '<h2>Top 3 Recommended Playlists:</h2><ol>' +
        topPlaylists.map(p => `<li>${p.name}</li>`).join('') +
        '</ol>';
}

// Initialize
window.onload = () => {
    createSliders();
    updateRecommendations(); // initial recommendation
};