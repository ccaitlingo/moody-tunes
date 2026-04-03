document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("prefsForm");
  const resultsDiv = document.getElementById("results");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    // Get user preferences from sliders
    const userPrefs = {
      happiness: parseInt(document.getElementById("happiness").value),
      angst: parseInt(document.getElementById("angst").value),
      energy: parseInt(document.getElementById("energy").value),
      indie: parseInt(document.getElementById("indie").value),
      sexy: parseInt(document.getElementById("sexy").value)
    };

    // Compute distance for each playlist
    function score(playlist) {
      return ["happiness","angst","energy","indie","sexy"]
        .reduce((sum, attr) => sum + Math.pow(playlist[attr] - userPrefs[attr], 2), 0);
    }

    const topPlaylists = playlists
      .slice() // copy
      .sort((a,b) => score(a) - score(b))
      .slice(0,3);

    // Show results clearly
    if(topPlaylists.length === 0) {
      resultsDiv.innerHTML = "<p>No playlists found.</p>";
    } else {
      resultsDiv.innerHTML = "<h2>Top 3 Playlists:</h2>" +
        "<ol>" +
        topPlaylists.map(p => `<li>${p.name}</li>`).join("") +
        "</ol>";
    }
  });
});