const navLinks = document.querySelectorAll('.upperNav > a');

for (let link of navLinks) {
  if (link.getAttribute('href').includes('/')) continue;
  link.addEventListener('click', e => {
    e.preventDefault();

    const href = link.getAttribute('href'); 

    const offsetTop = document.querySelector(href).offsetTop;

    window.scrollTo({
      top: offsetTop - 124,
      behavior: 'smooth'
    });
  });
}