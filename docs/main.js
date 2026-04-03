// main.js
// Make sure playlists.js is loaded before this file

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

// Prompt user for preferences
function getUserPreferences() {
    const prefs = {};
    const questions = [
        ['happiness', 'How happy are you feeling? (1 = sad, 5 = happy): '],
        ['angst', 'How angsty are you feeling? (1 = normal, 5 = angsty): '],
        ['energy', 'How energetic are you feeling? (1 = sleepy, 5 = FIRED UP): '],
        ['indie', 'How indie do you want the playlist to be? (1 = common, 5 = niche): '],
        ['sexy', 'How sexy/sassy are you feeling? (1 = platonic, 5 = sexy af): ']
    ];

    for (const [attr, question] of questions) {
        let value;
        do {
            value = parseInt(prompt(question));
        } while (isNaN(value) || value < 1 || value > 5);
        prefs[attr] = value;
    }

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
function recommendPlaylists(playlists, userPrefs, topN = 3) {
    const scored = playlists
        .map(p => ({ playlist: p, score: scorePlaylist(p, userPrefs) }))
        .sort((a, b) => a.score - b.score)
        .slice(0, topN)
        .map(obj => obj.playlist);
    return scored;
}

// Main function
function main() {
    // Convert raw playlist objects to Playlist instances
    const playlists = playlists_test.map(p => new Playlist(p.name, p.happiness, p.angst, p.energy, p.indie, p.sexy));
    
    const userPrefs = getUserPreferences();
    const topPlaylists = recommendPlaylists(playlists, userPrefs);

    // Display results
    const resultDiv = document.getElementById('results');
    resultDiv.innerHTML = '<h2>Top 3 Recommended Playlists:</h2><ol>' +
        topPlaylists.map(p => `<li>${p.name}</li>`).join('') +
        '</ol>';
}

// Run main after page loads
window.onload = main;