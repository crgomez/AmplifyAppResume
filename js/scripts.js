(function () {
    'use strict';

    // --------------------------------------------------------------------
    // PreLoader
    // --------------------------------------------------------------------

    (function () {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            setTimeout(function() {
                preloader.style.opacity = '0';
                preloader.style.transition = 'opacity 0.5s ease';
                setTimeout(function() {
                    preloader.style.display = 'none';
                }, 500);
            }, 100);
        }
    }());

    // --------------------------------------------------------------------
    // Mobile Hamburger Menu
    // --------------------------------------------------------------------

    (function () {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
        
        if (hamburger && navLinks) {
            // Toggle menu on hamburger click
            hamburger.addEventListener('click', function() {
                this.classList.toggle('active');
                navLinks.classList.toggle('active');
                
                // Update aria-expanded for accessibility
                const isExpanded = this.classList.contains('active');
                this.setAttribute('aria-expanded', isExpanded);
                
                // Prevent body scroll when menu is open
                document.body.style.overflow = isExpanded ? 'hidden' : '';
            });
            
            // Close menu when clicking on a link
            const navLinkItems = document.querySelectorAll('.nav-link');
            navLinkItems.forEach(link => {
                link.addEventListener('click', function() {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                });
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(event) {
                const isClickInsideNav = navLinks.contains(event.target);
                const isClickOnHamburger = hamburger.contains(event.target);
                
                if (!isClickInsideNav && !isClickOnHamburger && navLinks.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navLinks.classList.remove('active');
                    hamburger.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            });
        }
    }());

}());
