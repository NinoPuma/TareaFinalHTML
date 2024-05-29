document.addEventListener('DOMContentLoaded', () => {
  // Manejo del formulario de login
  let loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;

      // Dummy validation (replace with actual validation logic)
      if (username === 'admin' && password === '1234') {
        // Successful login, redirect to menu page
        window.location.href = 'menu.html';
      } else {
        // Display error message
        var errorMessage = document.getElementById('errorMessage');
        errorMessage.style.visibility = 'visible';
      }
    });
  }

  // Carrusel
  let currentIndex = 0;

  function moveSlide(direction) {
    const items = document.querySelectorAll('.carousel-item');
    const totalItems = items.length;

    items[currentIndex].classList.remove('active');

    currentIndex = (currentIndex + direction + totalItems) % totalItems;

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

  // API de películas
  const API_KEY = '41cf3c68';
  const movieContainer = document.getElementById('movie-container');
  const movieForm = document.getElementById('movie-form');
  const movieTitleInput = document.getElementById('movie-title');
  const initialMovies = ['Inception', 'The Dark Knight', 'Interstellar'];

  async function fetchMovieData(title) {
    const response = await fetch(`http://www.omdbapi.com/?t=${title}&apikey=${API_KEY}`);
    const data = await response.json();
    return data;
  }

  async function displayMovie(title) {
    const movieData = await fetchMovieData(title);
    if (movieData.Response === "True") {
      const movieElement = document.createElement('div');
      movieElement.classList.add('movie');
      movieElement.innerHTML = `
        <h2>${movieData.Title}</h2>
        <p>${movieData.Year}</p>
        <img src="${movieData.Poster}" alt="${movieData.Title}">
        <p>${movieData.Plot}</p>
      `;
      movieContainer.innerHTML = ''; // Clear previous movies
      movieContainer.appendChild(movieElement);
    } else {
      movieContainer.innerHTML = '<p>Película no encontrada</p>';
    }
  }

  async function displayInitialMovies() {
    movieContainer.innerHTML = ''; // Clear previous movies
    for (const title of initialMovies) {
      const movieData = await fetchMovieData(title);
      if (movieData.Response === "True") {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');
        movieElement.innerHTML = `
          <h2>${movieData.Title}</h2>
          <p>${movieData.Year}</p>
          <img class="poster" src="${movieData.Poster}" alt="${movieData.Title}">
          <p>${movieData.Plot}</p>
        `;
        movieContainer.appendChild(movieElement);
      }
    }
  }

  if (movieForm) {
    movieForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const title = movieTitleInput.value;
      displayMovie(title);
    });
  }

  displayInitialMovies(); // Display initial movies on page load

  // Manejo del formulario de solicitud de película
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
});