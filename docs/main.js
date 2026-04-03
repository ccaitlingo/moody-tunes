class Playlist {
    constructor(playlist_name, happiness, angst, energy, indie, sexy) {
        this.playlist_name = playlist_name;
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
const playlists = loaded_playlists.map(p => new Playlist(p.playlist_name, p.happiness, p.angst, p.energy, p.indie, p.sexy));

const attributes = [
    ['happiness', 'How happy are you feeling?'],
    ['angst', 'How angsty are you feeling?'],
    ['energy', 'How energetic are you feeling?'],
    ['indie', 'How indie do you want the playlist to be?'],
    ['sexy', 'How sexy/sassy are you feeling?']
];

// Add low/high labels for each attribute
const sliderLabels = {
    happiness: ['sad', 'happy'],
    angst: ['normal', 'angsty'],
    energy: ['sleepy', 'FIRED UP'],
    indie: ['common', 'niche'],
    sexy: ['platonic', 'sexy af']
};

function createSliders() {
    const slidersDiv = document.getElementById('sliders');
    attributes.forEach(([attr, labelText]) => {
        const container = document.createElement('div');
        container.className = 'slider-container';

        // Main label
        const label = document.createElement('label');
        label.textContent = labelText;
        label.htmlFor = attr;

        // Slider input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = attr;
        slider.min = 1;
        slider.max = 5;
        slider.value = 3; // default

        // Current value display
        const valueDisplay = document.createElement('span');
        valueDisplay.id = `${attr}-value`;
        valueDisplay.textContent = slider.value;

        slider.addEventListener('input', () => {
            valueDisplay.textContent = slider.value;
        });

        // Low/High labels
        const lowHighDiv = document.createElement('div');
        lowHighDiv.className = 'slider-labels';
        lowHighDiv.style.display = 'flex';
        lowHighDiv.style.justifyContent = 'space-between';
        lowHighDiv.style.fontSize = '0.9em';
        lowHighDiv.style.marginTop = '5px';
        lowHighDiv.innerHTML = `<span>${sliderLabels[attr][0]}</span><span>${sliderLabels[attr][1]}</span>`;

        // Append everything
        container.appendChild(label);
        container.appendChild(slider);
        container.appendChild(valueDisplay);
        container.appendChild(lowHighDiv);

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

// Display recommendations
function showRecommendations() {
    const userPrefs = getUserPreferences();
    const topPlaylists = recommendPlaylists(userPrefs);

    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '<h2>Top 3 Recommended Playlists:</h2><ol>' +
        topPlaylists.map(p => `<li>${p.playlist_name}</li>`).join('') +
        '</ol>';
}

// Initialize
window.onload = () => {
    createSliders();
    const button = document.getElementById('get-recommendations');
    button.addEventListener('click', showRecommendations);
};