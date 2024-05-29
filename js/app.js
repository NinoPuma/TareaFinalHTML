document.addEventListener('DOMContentLoaded', () => {
  // Validación de inicio de sesión
  let loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
          event.preventDefault();
          var username = document.getElementById('username').value;
          var password = document.getElementById('password').value;

          // Validación ficticia (reemplazar con la lógica de validación real)
          if (username === 'admin' && password === '1234') {
              // Inicio de sesión exitoso, redirigir a la página del menú
              window.location.href = 'menu.html';
          } else {
              // Mostrar mensaje de error
              var errorMessage = document.getElementById('errorMessage');
              errorMessage.style.visibility = 'visible';
          }
      });
  }

  // Funcionalidad del carrusel
  let currentIndex = 0;

  function moveSlide(direction) {
      const items = document.querySelectorAll('.carousel-item');
      const totalItems = items.length;

      console.log('Current Index:', currentIndex); // Agregado para depuración
      console.log('Direction:', direction); // Agregado para depuración

      items[currentIndex].classList.remove('active');

      currentIndex = (currentIndex + direction + totalItems) % totalItems;

      console.log('New Index:', currentIndex); // Agregado para depuración

      items[currentIndex].classList.add('active');
      document.querySelector('.carousel-inner').style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');

  if (nextButton && prevButton) {
      nextButton.addEventListener('click', () => moveSlide(1));
      prevButton.addEventListener('click', () => moveSlide(-1));
  } else {
      console.error('Buttons not found');
  }

  // Función de menú responsive
  function burger() {
      var x = document.getElementById("myTopnav");
      if (x.className === "topnav") {
          x.className += " responsive";
      } else {
          x.className = "topnav";
      }
  }

  // Generación dinámica de la lista de películas
  const movies = [
      { id: 'tt0111161', title: 'The Shawshank Redemption' },
      { id: 'tt0068646', title: 'The Godfather' },
      { id: 'tt0071562', title: 'The Godfather: Part II' },
      { id: 'tt0468569', title: 'The Dark Knight' },
      { id: 'tt0050083', title: '12 Angry Men' },
      { id: 'tt0108052', title: 'Schindler\'s List' },
      { id: 'tt0167260', title: 'The Lord of the Rings: The Return of the King' },
      { id: 'tt0110912', title: 'Pulp Fiction' }
  ];

  const movieListContainer = document.getElementById('movie-list');
  const omdbApiKey = '41cf3c68'; // Tu clave de API de OMDB

  async function fetchMoviePoster(imdbID) {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
      const data = await response.json();
      return data.Poster;
  }

  if (movieListContainer) {
      movies.forEach(async (movie) => {
          const movieItem = document.createElement('div');
          movieItem.classList.add('movie-item');

          const movieLink = document.createElement('a');
          movieLink.href = `pelicula.html?id=${movie.id}`;

          const movieImage = document.createElement('img');
          movieImage.alt = movie.title;
          movieImage.style.cursor = 'pointer';

          // Obtener la URL del poster de la API de OMDB
          const posterUrl = await fetchMoviePoster(movie.id);
          movieImage.src = posterUrl;

          movieImage.onclick = () => {
              window.location.href = `pelicula.html?id=${movie.id}`;
          };

          const movieTitle = document.createElement('p');
          movieTitle.textContent = movie.title;

          movieLink.appendChild(movieImage);
          movieItem.appendChild(movieLink);
          movieItem.appendChild(movieTitle);
          movieListContainer.appendChild(movieItem);
      });
  }

  // Carga dinámica de detalles de la película
  const youtubeApiKey = 'AIzaSyAfdJqBEhAo3RLbLpvd74JNOCZBBj44wiw'; // Tu clave de API de YouTube

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
