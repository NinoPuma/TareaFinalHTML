document.addEventListener('DOMContentLoaded', () => {
  // Validación de inicio de sesión
  let loginForm = document.getElementById('loginForm');
  if (loginForm) {
      loginForm.addEventListener('submit', function(event) {
          event.preventDefault();
          var username = document.getElementById('username').value;
          var password = document.getElementById('password').value;

          // Validación ficticia de inicio de sesión (reemplazar con lógica real)
          if (username === 'admin' && password === '1234') {
              // Redirigir a la página del menú en caso de inicio de sesión exitoso
              window.location.href = 'menu.html';
          } else {
              // Mostrar mensaje de error en caso de credenciales incorrectas
              var errorMessage = document.getElementById('errorMessage');
              errorMessage.style.visibility = 'visible';
          }
      });
  }

  // Funcionalidad del carrusel
  let currentIndex = 0;

  // Función para mover el carrusel en la dirección especificada
  function moveSlide(direction) {
      const items = document.querySelectorAll('.carousel-item');
      const totalItems = items.length;

      // Quitar la clase 'active' del elemento actual
      items[currentIndex].classList.remove('active');
      // Calcular el nuevo índice
      currentIndex = (currentIndex + direction + totalItems) % totalItems;
      // Añadir la clase 'active' al nuevo elemento
      items[currentIndex].classList.add('active');
      // Ajustar la posición del carrusel
      document.querySelector('.carousel-inner').style.transform = `translateX(-${currentIndex * 100}%)`;
  }

  // Obtener los botones de navegación del carrusel
  const nextButton = document.querySelector('.next');
  const prevButton = document.querySelector('.prev');

  // Añadir eventos de clic a los botones del carrusel
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

  // Lista de películas iniciales con sus IDs de IMDb
  const movies = [
      { id: 'tt0111161', title: 'The Shawshank Redemption' },
      { id: 'tt0068646', title: 'The Godfather' },
      { id: 'tt0071562', title: 'The Godfather: Part II' },
      { id: 'tt0468569', title: 'The Dark Knight' },
      { id: 'tt0050083', title: '12 Angry Men' },
      { id: 'tt0108052', title: 'Schindler\'s List' },
      { id: 'tt0167260', title: 'The Lord of the Rings: The Return of the King' },
      { id: 'tt0110912', title: 'Pulp Fiction' },
      { id: 'tt0120338', title: 'Titanic' },
      { id: 'tt0033467', title: 'Tarzan' },
      { id: 'tt1170358', title: 'The Hobbit: The Desolation of Smaug' },
      { id: 'tt0107290', title: 'Jurassic Park' },
      { id: 'tt0076759', title: 'Star Wars: Episode IV - A New Hope' },
      { id: 'tt0114709', title: 'Toy Story' },
      { id: 'tt7286456', title: 'Joker' }
  ];


  // URL de la imagen predeterminada
  const defaultPosterUrl = 'img/mantenimiento.jpg';


  const movieListContainer = document.getElementById('movie-list'); // Contenedor de la lista de películas
  const omdbApiKey = '41cf3c68'; // Clave de API de OMDB

  // Función para obtener el póster de una película dado su ID de IMDb
  async function fetchMoviePoster(imdbID) {
      const response = await fetch(`https://www.omdbapi.com/?i=${imdbID}&apikey=${omdbApiKey}`);
      const data = await response.json();
      return data.Poster !== "N/A" ? data.Poster : defaultPoster;
  }

  // Función para mostrar las películas iniciales en la página de menú
  async function displayInitialMovies() {
      movieListContainer.innerHTML = ''; // Limpiar películas anteriores
      for (const movie of movies) {
          const movieElement = document.createElement('div'); // Crear contenedor para cada película
          movieElement.classList.add('movie-item');

          const movieLink = document.createElement('a'); // Crear enlace para cada película
          movieLink.href = `pelicula.html?id=${movie.id}`;

          const movieImage = document.createElement('img'); // Crear elemento de imagen para el póster
          movieImage.alt = movie.title;
          movieImage.style.cursor = 'pointer';

          // Obtener la URL del póster de la API de OMDB
          const posterUrl = await fetchMoviePoster(movie.id);
          movieImage.src = posterUrl;


            // Asegurar que la imagen tenga las dimensiones correctas
      movieImage.style.width = '280px';
      movieImage.style.height = '418px';

          // Añadir evento de clic para redirigir a la página de detalles de la película
          movieImage.onclick = () => {
              window.location.href = `pelicula.html?id=${movie.id}`;
          };

          const movieTitle = document.createElement('p'); // Crear elemento para el título de la película
          movieTitle.textContent = movie.title;

          // Añadir la imagen y el título al enlace, y el enlace al contenedor de la película
          movieLink.appendChild(movieImage);
          movieElement.appendChild(movieLink);
          movieElement.appendChild(movieTitle);
          movieListContainer.appendChild(movieElement);
      }
  }

  // Función para obtener los datos de las películas por título desde la API de OMDB
  async function fetchMovieData(title) {
      const response = await fetch(`https://www.omdbapi.com/?s=${title}&apikey=${omdbApiKey}`);
      const data = await response.json();
      return data;
  }

  // Función para mostrar las películas obtenidas en la búsqueda
  async function displayMovies(movieData) {
      if (movieData.Response === "True") {
          movieListContainer.innerHTML = ''; // Limpiar películas anteriores
          const movies = movieData.Search.slice(0, 15); // Limitar a 15 resultados
          movies.forEach(async movie => {
              const movieElement = document.createElement('div'); // Crear contenedor para cada película
              movieElement.classList.add('movie-item');

              const movieLink = document.createElement('a'); // Crear enlace para cada película
              movieLink.href = `pelicula.html?id=${movie.imdbID}`;

              const movieImage = document.createElement('img'); // Crear elemento de imagen para el póster
              movieImage.src = await fetchMoviePoster(movie.imdbID);
              movieImage.alt = movie.Title;
              movieImage.style.cursor = 'pointer';

              const movieTitle = document.createElement('p'); // Crear elemento para el título de la película
              movieTitle.textContent = movie.Title;

              // Añadir la imagen y el título al enlace, y el enlace al contenedor de la película
              movieLink.appendChild(movieImage);
              movieElement.appendChild(movieLink);
              movieElement.appendChild(movieTitle);
              movieListContainer.appendChild(movieElement);
          });
      } else {
          movieListContainer.innerHTML = '<p>Película no encontrada</p>'; // Mensaje si no se encuentran películas
      }
  }

  const movieForm = document.getElementById('movie-form'); // Formulario de búsqueda de películas
  const movieTitleInput = document.getElementById('movie-title'); // Campo de entrada de búsqueda

  // Manejo del evento de envío del formulario de búsqueda
  if (movieForm) {
      movieForm.addEventListener('submit', (event) => {
          event.preventDefault();
          const title = movieTitleInput.value;
          fetchMovieData(title).then(displayMovies);
      });

      // Mostrar las películas iniciales al cargar la página
      displayInitialMovies(); 
  }

  // Carga dinámica de detalles de la película
  const youtubeApiKey = 'AIzaSyAfdJqBEhAo3RLbLpvd74JNOCZBBj44wiw'; // Clave de API de YouTube

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


const datalist = document.getElementById('years');
  const input = document.getElementById('movieYear');
  const startYear = 1900;
  const endYear = 2024;

  for (let year = startYear; year <= endYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    datalist.appendChild(option);
  }

  const form = document.getElementById('request-form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email');
    const movieName = document.getElementById('movieName');
    const movieYear = document.getElementById('movieYear');
    const language = document.getElementById('language');
    const terms = document.getElementById('terms');

    let valid = true;
    let errorMessage = 'Errores encontrados en los siguientes campos:\n';

    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach((el) => {
      el.textContent = '';
      el.classList.remove('show');
    });

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email.value)) {
      valid = false;
      const emailError = document.getElementById('email-error');
      emailError.textContent = 'Incluye una "@" y un "." en la dirección de correo electrónico.';
      emailError.classList.add('show');
      email.classList.add('input-error');
      errorMessage += '- Correo electrónico inválido\n';
    } else {
      email.classList.remove('input-error');
    }

    // Movie name validation
    if (movieName.value.trim() === '') {
      valid = false;
      const movieNameError = document.getElementById('movieName-error');
      movieNameError.textContent = 'El nombre de la película es obligatorio.';
      movieNameError.classList.add('show');
      movieName.classList.add('input-error');
      errorMessage += '- Nombre de la película es obligatorio\n';
    } else {
      movieName.classList.remove('input-error');
    }

    // Movie year validation
    const yearPattern = /^(19[0-9]{2}|20[0-2][0-4])$/;
    if (!yearPattern.test(movieYear.value)) {
      valid = false;
      const movieYearError = document.getElementById('movieYear-error');
      movieYearError.textContent = 'El año debe ser un número de 4 dígitos entre 1900 y 2024.';
      movieYearError.classList.add('show');
      movieYear.classList.add('input-error');
      errorMessage += '- Año de la película inválido\n';
    } else {
      movieYear.classList.remove('input-error');
    }

    // Language validation
    if (language.value.trim() === '') {
      valid = false;
      const languageError = document.getElementById('language-error');
      languageError.textContent = 'El idioma de la película es obligatorio.';
      languageError.classList.add('show');
      language.classList.add('input-error');
      errorMessage += '- Idioma de la película es obligatorio\n';
    } else {
      language.classList.remove('input-error');
    }

    // Terms and conditions validation
    if (!terms.checked) {
      valid = false;
      const termsError = document.getElementById('terms-error');
      termsError.textContent = 'Debe aceptar los términos y condiciones.';
      termsError.classList.add('show');
      terms.classList.add('input-error');
      errorMessage += '- Aceptar los términos y condiciones\n';
    } else {
      terms.classList.remove('input-error');
    }

    if (valid) {
      // Mostrar mensaje de confirmación
      alert('Formulario enviado correctamente');
      // Redirigir a la página de menú después de que se cierra la alerta
      window.location.href = 'menu.html';
    } else {
      // Mostrar mensaje de error
      alert(errorMessage);
    }
  });

  // Dynamic filtering of years
  const movieYearInput = document.getElementById('movieYear');

  movieYearInput.addEventListener('input', () => {
    const value = movieYearInput.value;
    const startYear = value.startsWith('2') ? 2000 : 1900;
    const endYear = 2024;
    datalist.innerHTML = '';

    if (value.length > 0) {
      for (let year = startYear; year <= endYear; year++) {
        if (year.toString().startsWith(value)) {
          const option = document.createElement('option');
          option.value = year;
          datalist.appendChild(option);
        }
      }
    }
  });