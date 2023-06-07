const clientId = 'dd2aa4b61d33446f85da427e3e3259c1';
const redirectUri = 'http://localhost:5501/';
let accessToken;


const params = new URLSearchParams(window.location.search);
const authorizationCode = params.get('code');

if (authorizationCode) {

    exchangeAuthorizationCode(authorizationCode);
} else {

    redirectToAuthorizationPage();
}

function redirectToAuthorizationPage() {
    const scopes = 'user-top-read';
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;

    window.location.href = authUrl;
}

function exchangeAuthorizationCode(code) {
    const body = {
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
        client_id: clientId,
        client_secret: '8e9ab676c1884a5f9be95d96e7a21791'
    };

    fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams(body)
    })
        .then(response => response.json())
        .then(data => {
            accessToken = data.access_token;
            fetchMostListenedSongs(accessToken);
            updateSongs();
        })
        .catch(error => console.log(error));
}

function fetchMostListenedSongs(accessToken) {
    return fetch('https://api.spotify.com/v1/me/top/tracks?limit=50', {
        headers: {
            'Authorization': 'Bearer ' + accessToken
        }
    })
        .then(response => response.json())
        .then(data => {
            const songs = data.items;
            const randomSongs = getRandomSongs(songs, 2);

            const songContainer = document.getElementById('song-container');
            songContainer.innerHTML = '';

            randomSongs.forEach((song, index) => {
                const songName = song.name;
                const artist = song.artists[0].name;
                const imageUrl = song.album.images[0].url;

                const songElement = document.createElement('div');
                songElement.innerHTML = `
                    <div>
                        <img src="${imageUrl}" alt="Album Artwork">
                        <p>Song: ${songName}</p>
                        <p>Artist: ${artist}</p>
                    </div>
                `;
                songElement.onclick = () => makeGuess(index + 1);
                songContainer.appendChild(songElement);
            });

            return randomSongs;
        })
        .catch(error => console.log(error));
}

function getRandomSongs(songs, count) {
    const randomSongs = [];
    const totalSongs = songs.length;

    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * totalSongs);
        const song = songs[randomIndex];
        randomSongs.push(song);
    }

    return randomSongs;
}


let correctAnswers = 0;

function makeGuess(guess) {
    fetchMostListenedSongs(accessToken)
        .then(songs => {
            const mostListenedSong = songs[0].name;
            const guessedSong = document.getElementById(`song-${guess}`).textContent;

            const resultContainer = document.getElementById('result');
            const resultMessage = document.createElement('p');

            if (guessedSong === mostListenedSong) {
                correctAnswers++;
                resultMessage.textContent = 'Correct!';
                console.log('correct');
            } else {
                resultMessage.textContent = 'Incorrect!';
                console.log('incorrect');
            }

            resultContainer.appendChild(resultMessage);


            const correctAnswersElement = document.getElementById('correct-answers');
            correctAnswersElement.textContent = 'Correct answers: ' + correctAnswers;
        })
        .catch(error => console.log(error));
}








