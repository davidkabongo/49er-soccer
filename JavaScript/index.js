'use strict';

const hamburgerBtn = document.querySelector('.hamburger-btn');
const ul = document.querySelector('.nav-links');

hamburgerBtn.addEventListener('click', () => {
    ul.classList.toggle('active');
});

