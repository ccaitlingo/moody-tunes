import csv

class Playlist:
    def __init__(self, playlist_name, happiness, angst, energy, indie, sexy):
        self.playlist_name = playlist_name
        self.attributes = {
            'happiness': int(happiness),
            'angst': int(angst),
            'energy': int(energy),
            'indie': int(indie),
            'sexy': int(sexy)
        }

def load_playlists(filename):
    playlists = []
    with open(filename, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            playlists.append(Playlist(
                row['playlist_name'],
                row['happiness'],
                row['angst'],
                row['energy'],
                row['indie'],
                row['sexy']
            ))
    return playlists

def get_user_preferences():
    prefs = {}
    for attr, prompt in [
        ('happiness', 'How happy are you feeling? (1 = sad, 5 = happy): '),
        ('angst', 'How angsty are you feeling? (1 = normal, 5 = angsty): '),
        ('energy', 'How energetic are you feeling? (1 = sleepy, 5 = FIRED UP): '),
        ('indie', 'How indie do you want the playlist to be? (1 = common, 5 = niche): '),
        ('sexy', 'How sexy/sassy are you feeling? (1 = platonic, 5 = sexy af): ')
    ]:
        while True:
            try:
                value = int(input(prompt))
                if 1 <= value <= 5:
                    prefs[attr] = value
                    break
            except ValueError:
                pass
    return prefs

def score_playlist(playlist, user_prefs):
    return sum((playlist.attributes[attr] - user_prefs[attr])**2 for attr in user_prefs)

def recommend_playlists(playlists, user_prefs, top_n=3):
    scored = sorted(playlists, key=lambda p: score_playlist(p, user_prefs))
    return scored[:top_n]

def main():
    # filename = input("Enter the CSV filename of your playlists: ")
    filename = "./inputs.csv"
    playlists = load_playlists(filename)
    user_prefs = get_user_preferences()
    top_playlists = recommend_playlists(playlists, user_prefs)
    
    print("\nTop 3 recommended playlists:")
    for i, p in enumerate(top_playlists, 1):
        print(f"{i}. {p.playlist_name}")

if __name__ == "__main__":
    main()