document.addEventListener('DOMContentLoaded', function() {
    const omdbApiKey = '41cf3c68'; // Clave de API de OMDB
    const youtubeApiKey = 'AIzaSyAfdJqBEhAo3RLbLpvd74JNOCZBBj44wiw'; // Clave de API de YouTube

    const urlParams = new URLSearchParams(window.location.search);
    const imdbID = urlParams.get('id');

    if (imdbID) {
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.Response === "True") {
                    document.getElementById('movie-title').textContent = data.Title;
                    document.getElementById('movie-description').textContent = data.Plot;
                    document.getElementById('movie-year').querySelector('span').textContent = data.Year;
                    document.getElementById('movie-director').querySelector('span').textContent = data.Director;
                    document.getElementById('movie-rating').querySelector('span').textContent = data.imdbRating;

                    // Buscar el tráiler en YouTube
                    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(data.Title + ' trailer')}&key=${youtubeApiKey}`)
                        .then(response => response.json())
                        .then(youtubeData => {
                            const trailerId = youtubeData.items[0].id.videoId;
                            document.getElementById('trailer').src = `https://www.youtube.com/embed/${trailerId}`;
                            document.getElementById('movie-external-link').href = `https://www.youtube.com/watch?v=${trailerId}`;
                        })
                        .catch(error => console.error('YouTube API error:', error));
                } else {
                    console.error('Error fetching movie data:', data.Error);
                }
            })
            .catch(error => console.error('Fetch error:', error));
    } else {
        console.error('No IMDb ID provided in URL');
    }
});
