# generate_playlist_js.py

import csv
import json
import os

LABEL = "_CAITLIN"

# Config
csv_file = "scratch/inputs.csv"     # CSV file with playlists
output_folder = "./docs"            # Folder to save playlist_LABEL.js
js_file = os.path.join(output_folder, f"playlists{LABEL}.js")

# Read CSV
playlists = []
with open(csv_file, newline='', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        playlist = {}
        for key, value in row.items():
            value = value.strip()
            # Convert to int or float if possible
            if value.isdigit():
                playlist[key] = int(value)
            else:
                try:
                    playlist[key] = float(value)
                except ValueError:
                    playlist[key] = value
        playlists.append(playlist)

# Convert to JS format
def jsify(obj):
    if isinstance(obj, str):
        return f'"{obj}"'
    elif isinstance(obj, (int, float)):
        return str(obj)
    elif isinstance(obj, dict):
        items = [f"{k}: {jsify(v)}" for k, v in obj.items()]
        return "{ " + ", ".join(items) + " }"
    elif isinstance(obj, list):
        return "[\n  " + ",\n  ".join(jsify(i) for i in obj) + "\n]"
    return str(obj)

js_playlists = jsify(playlists)

# Write to playlist_LABEL.js
with open(js_file, "w", encoding="utf-8") as f:
    f.write(f"const LABEL = '{LABEL}';\n")
    f.write(f"const loaded_playlists = {js_playlists};\n")

print(f"playlist.js has been created at {js_file}")