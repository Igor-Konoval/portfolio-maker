let buttonUp = document.querySelector('.buttonUp');
buttonUp.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

window.addEventListener('scroll', function() {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop > 124) {
        buttonUp.parentElement.style.display = 'block';
    } else {
        buttonUp.parentElement.style.display = 'none';
    }
});
