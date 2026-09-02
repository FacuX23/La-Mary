document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navbarMenu = document.querySelector('.navbar-menu');

    if (mobileMenuToggle && navbarMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            const isActive = navbarMenu.classList.toggle('is-active');
            mobileMenuToggle.setAttribute('aria-expanded', isActive);
        });

        // Close menu when clicking on a link
        const navLinks = navbarMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navbarMenu.classList.remove('is-active');
                mobileMenuToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
