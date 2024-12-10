'use strict';

const leftBtn = document.querySelector('.left');
const rightBtn = document.querySelector('.right');
const hamburgerBtn = document.querySelector('.hamburger-btn');
const navLinks = document.querySelector('.nav-links');

const carouselItems = Array.from(document.querySelectorAll('.carousel-item'));
const navItems = Array.from(document.querySelectorAll('.nav-item'));
const CAROUSEL_SIZE = carouselItems.length;

// Ensure the carousel initializes properly on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    if (carouselItems.length > 0 && navItems.length > 0) {
        carouselItems[0].classList.add('active');
        navItems[0].classList.add('active');
    } else {
        console.error('Carousel items or nav items not found.');
    }
});

// Swipe logic for left and right buttons
if (leftBtn && rightBtn && carouselItems.length > 0 && navItems.length > 0) {
    leftBtn.addEventListener('click', swipe);
    rightBtn.addEventListener('click', swipe);

    function swipe(e) {
        const currentCarouselItem = document.querySelector('.carousel-item.active');
        const currentIndex = carouselItems.indexOf(currentCarouselItem);

        if (currentIndex === -1) {
            console.error('Error: Active carousel item not found.');
            return;
        }

        // Determine the next index
        let nextIndex = e.currentTarget.classList.contains('left')
            ? (currentIndex === 0 ? CAROUSEL_SIZE - 1 : currentIndex - 1)
            : (currentIndex === CAROUSEL_SIZE - 1 ? 0 : currentIndex + 1);

        console.log('Current Index:', currentIndex, 'Next Index:', nextIndex);

        // Update carousel items
        carouselItems[currentIndex].classList.remove('active');
        carouselItems[nextIndex].classList.add('active');

        // Update navigation dots
        navItems[currentIndex].classList.remove('active');
        navItems[nextIndex].classList.add('active');
    }
}

// Hamburger menu toggle logic
if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburgerBtn.classList.toggle('active');
    });
}

// Ensure the carousel displays correctly on window resize
window.addEventListener('resize', () => {
    const activeItem = document.querySelector('.carousel-item.active');
    if (!activeItem && carouselItems.length > 0) {
        carouselItems[0].classList.add('active');
        navItems[0].classList.add('active');
    }
});
