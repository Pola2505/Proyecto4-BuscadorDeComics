window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const parallax = document.getElementById('parallax-img');
    parallax.style.transform = `translateY(${scrollY * 0.3}px)`; 
  });