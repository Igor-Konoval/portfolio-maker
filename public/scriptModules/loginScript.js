const usernameInput = document.querySelector('#regOne');
const loginSubmit = document.querySelector('#login_submit');
let form = document.querySelector('.login_form');

document.addEventListener('DOMContentLoaded', (event)=> {
    if (!localStorage.getItem('username')) return;
    usernameInput.value = localStorage.getItem('username');
})

form.onsubmit = function(event) {
    localStorage.removeItem('username');
    localStorage.setItem('username', usernameInput.value);
    event.preventDefault();
    form.submit();
}