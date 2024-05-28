// script.js
document.addEventListener('DOMContentLoaded', () => {
  let loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function(event) {
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
});



document.addEventListener('DOMContentLoaded', () => {
  // Función para redirigir a index.html
  function redirectToHome() {
      window.location.href = 'index.html';
  }

  // Función para solicitar películas (puedes agregar la lógica que necesites)
  function requestMovies() {
      alert('Función para solicitar películas');
  }

  // Función para alternar el menú móvil
  function toggleMenu() {
      const menu = document.getElementById('mobileMenu');
      menu.classList.toggle('active');
  }

  // Añadir event listeners
  document.querySelector('header .logo').addEventListener('click', redirectToHome);
  document.querySelector('.hamburger').addEventListener('click', toggleMenu);

  // Aseguramos que los botones del menú móvil también redirigen correctamente
  const navBtns = document.querySelectorAll('.menu .nav-btn');
  navBtns.forEach(btn => {
      if (btn.textContent.includes('Volver a inicio')) {
          btn.addEventListener('click', redirectToHome);
      } else if (btn.textContent.includes('Solicitar películas')) {
          btn.addEventListener('click', requestMovies);
      }
  });
});
