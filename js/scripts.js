jQuery(function ($) {

    'use strict';

    // --------------------------------------------------------------------
    // PreLoader
    // --------------------------------------------------------------------

    (function () {
        $('#preloader').delay(100).fadeOut('slow');
    }());

    // --------------------------------------------------------------------
    // Scroll Animations - Intersection Observer
    // --------------------------------------------------------------------

    (function () {
        // Check if browser supports Intersection Observer
        if ('IntersectionObserver' in window) {
            // Options for the observer
            const observerOptions = {
                root: null, // viewport
                rootMargin: '0px 0px -100px 0px', // Trigger slightly before element enters viewport
                threshold: 0.1 // Trigger when 10% of element is visible
            };

            // Create the observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Add visible class when element enters viewport
                        entry.target.classList.add('visible');
                        // Optional: unobserve after animation to improve performance
                        observer.unobserve(entry.target);
                    }
                });
            }, observerOptions);

            // Observe all elements with animation classes
            const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .timeline-node');
            animatedElements.forEach(element => {
                observer.observe(element);
            });
        } else {
            // Fallback for browsers that don't support Intersection Observer
            // Just show all elements immediately
            const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .timeline-node');
            animatedElements.forEach(element => {
                element.classList.add('visible');
            });
        }
    }());


}); // JQuery end
