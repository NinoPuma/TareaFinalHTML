// Ejecutar cuando el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Clave de API de OMDB
    const omdbApiKey = '41cf3c68';
    // Clave de API de YouTube
    const youtubeApiKey = 'AIzaSyAfdJqBEhAo3RLbLpvd74JNOCZBBj44wiw';

    // Obtener los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    // Extraer el valor del parámetro 'id' que corresponde al ID de IMDb de la película
    const imdbID = urlParams.get('id');

    // Verificar si hay un ID de IMDb proporcionado en la URL
    if (imdbID) {
        // Hacer una solicitud a la API de OMDB para obtener los detalles de la película
        fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`)
            .then(response => response.json()) // Convertir la respuesta a formato JSON
            .then(data => {
                // Verificar si la respuesta de la API es exitosa
                if (data.Response === "True") {
                    // Actualizar el contenido del DOM con los detalles de la película
                    document.getElementById('movie-title').textContent = data.Title;
                    document.getElementById('movie-description').textContent = data.Plot;
                    document.getElementById('movie-year').querySelector('span').textContent = data.Year;
                    document.getElementById('movie-director').querySelector('span').textContent = data.Director;
                    document.getElementById('movie-rating').querySelector('span').textContent = data.imdbRating;

                    // Buscar el tráiler en YouTube
                    fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${encodeURIComponent(data.Title + ' trailer')}&key=${youtubeApiKey}`)
                        .then(response => response.json()) // Convertir la respuesta a formato JSON
                        .then(youtubeData => {
                            // Obtener el ID del video del tráiler
                            const trailerId = youtubeData.items[0].id.videoId;
                            // Actualizar el iframe para mostrar el tráiler
                            document.getElementById('trailer').src = `https://www.youtube.com/embed/${trailerId}`;
                            // Actualizar el enlace externo al tráiler en YouTube
                            document.getElementById('movie-external-link').href = `https://www.youtube.com/watch?v=${trailerId}`;
                        })
                        .catch(error => console.error('YouTube API error:', error)); // Manejar errores de la API de YouTube
                } else {
                    // Manejar errores en la respuesta de la API de OMDB
                    console.error('Error fetching movie data:', data.Error);
                }
            })
            .catch(error => console.error('Fetch error:', error)); // Manejar errores de la solicitud fetch
    } else {
        // Manejar el caso en que no se proporcione un ID de IMDb en la URL
        console.error('No IMDb ID provided in URL');
    }
});
